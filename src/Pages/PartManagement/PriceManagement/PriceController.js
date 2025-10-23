const express = require('express');
const pool = require("../../Config/db_pool");
const fs = require('fs');
const csvParser = require('csv-parser');
const Queue = require('bull');
const XLSX = require('xlsx');
const { parse } = require('json2csv');
const path = require('path');

exports.UploadPriceFile = async(req, res) => {


  console.log('Request file:', req.file);
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).send("No file uploaded or file buffer is empty.");
  }

  console.log('File buffer received:', req.file.buffer);

    try {
      var post_fields = {
        VPF_SOURCE: req.file.filename,
        VPF_STATUS: 0,
        VPF_DATETIME: new Date(),
        VPF_VENDOR_ID: 1,
        VPF_JOB_ID: 0,
      }
      await pool.query(`INSERT INTO VENDOR_PRICING_FILES SET ?`, post_fields)
      
      return res.json({success: true, message: "File saved successfully."});
    } catch (err) {
      return res.json({success: false, message: err});
    }
};

function sanitizeColumnName(name) {
  return name.replace(/[^a-zA-Z_]/g, ''); // Remove any character that is not a letter or underscore
}





exports.GetPriceFiles = async(req, res) => {
  try{
        var [rows , f] = await pool.query('SELECT * FROM VENDOR_PRICING_FILES ORDER BY VENDOR_PRICING_FILE_ID DESC')
        return res.json({success: true, data: rows});
  }catch(err){
        return res.json({success: false, message: ''});
  }
}
 



const dataProcessingQueue = new Queue('dataProcessing', {
redis: { host: '127.0.0.1', port: 6379 }  // Redis config
});

// Define job processor (process multiple jobs independently)
dataProcessingQueue.process(1, async (job, done) => {
  const { file_path, file_id } = job.data;

  try {
    await UpdatePrice(file_id, file_path);
    done();  // Job completed successfully
  } catch (error) {
    done(error);  // Mark job as failed if there's an error
  }
});
exports.StartUpdating = async (req, res) => {
  try {
    const { file_name, file_id } = req.body;

    if (!file_name || !file_id) {
      return res.status(400).json({ success: false, message: 'File name or ID is missing', req: req.body });
    }

    const file_path = `./uploads/${file_name}`;

    const job = await dataProcessingQueue.add({ file_path, file_id });

    await pool.query('UPDATE VENDOR_PRICING_FILES SET VPF_STATUS = 1, VPF_JOB_ID = ? WHERE VENDOR_PRICING_FILE_ID = ?', [job.id, file_id]);

    return res.status(200).json({ success: true, message: `Processing for ${file_name} started with Job ID: ${job.id}` });

  } catch (error) {
    await pool.query('UPDATE VENDOR_PRICING_FILES SET VPF_STATUS = 3 WHERE VENDOR_PRICING_FILE_ID = ?', [req.body.file_id]);

    return res.status(200).json({ success: false, message: 'Failed to start the job: ' + error.message });
  }
};

const UpdatePrice = async(file_id, file_path) => {
  const connection = await pool.getConnection();
    try {
      const query = `
          INSERT INTO VENDOR_PRICING (VD_NUMBER, VD_PRICE_MRP, VD_PRICE)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE 
          VD_PRICE_MRP = VALUES(VD_PRICE_MRP), 
          VD_PRICE = VALUES(VD_PRICE);
      `;

      const rows = [];

      // Read and parse the CSV file
      fs.createReadStream(file_path)
          .pipe(csv())
          .on('data', (row) => {
              // Prepare values from CSV row
              const values = [row.VD_NUMBER, row.VD_PRICE_MRP, row.VD_PRICE];
              rows.push(values);
          })
          .on('end', async () => {
              console.log('CSV file successfully processed.');

              try {
                  // Begin transaction
                  await connection.beginTransaction();

                  // Insert or update each row
                  for (const values of rows) {
                      await connection.execute(query, values);
                  }

                  // Commit transaction
                  await connection.commit();
                  console.log('Data successfully inserted/updated.');
                  await pool.query('UPDATE VENDOR_PRICING_FILES SET VPF_STATUS = 2 WHERE VENDOR_PRICING_FILE_ID = ?', [file_id]);
                  return true;
              } catch (error) {
                  console.error('Error inserting/updating data:', error);
                  await connection.rollback(); // Rollback if error occurs
                  await pool.query('UPDATE VENDOR_PRICING_FILES SET VPF_STATUS = 3 WHERE VENDOR_PRICING_FILE_ID = ?', [file_id]);
                  return false;
              } finally {
                  connection.release(); // Always release the connection
                  return true;
              }
          });
  } catch (err) {
      console.error('Error with database connection or CSV processing:', err);
  }
}
const UpdatePricex = (file_id, file_path) => {
  
  return new Promise((resolve, reject) => {
    const csvRows = [];
    fs.createReadStream(file_path)
      .pipe(csvParser())
      .on('data', (row) => {
        const sanitizedRow = {};
        for (const key in row) {
          if (Object.prototype.hasOwnProperty.call(row, key)) {
            const sanitizedKey = sanitizeColumnName(key);
            sanitizedRow[sanitizedKey] = row[key];
          }
        }
        csvRows.push(sanitizedRow);
      })
      .on('end', async () => {
        const connection = await pool.getConnection();
        try {
          await Promise.all(csvRows.map(async (row) => {
            const query = `
            INSERT INTO VENDOR_PRICING (VD_NUMBER, VD_PRICE_MRP, VD_PRICE)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            VD_PRICE_MRP = VALUES(VD_PRICE_MRP), 
            VD_PRICE = VALUES(VD_PRICE);
            `;
            const values = [row.part_number, row.price_mrp, row.price];
            await pool.query(query, values);
          }));

          await pool.query('UPDATE VENDOR_PRICING_FILES SET VPF_STATUS = 2 WHERE VENDOR_PRICING_FILE_ID = ?', [file_id]);
          resolve(true);
        } catch (error) {
          await pool.query('UPDATE VENDOR_PRICING_FILES SET VPF_STATUS = 3 WHERE VENDOR_PRICING_FILE_ID = ?', [file_id]);
          reject(error);
        } finally {
          connection.release();
        }
      })
      .on('error', (error) => {
        pool.query('UPDATE VENDOR_PRICING_FILES SET VPF_STATUS = 3 WHERE VENDOR_PRICING_FILE_ID = ?', [file_id]);
        reject(error);
      });
  });
}


exports.DeletePriceFile = async(req, res) => {

  await pool.query('DELETE FROM VENDOR_PRICING_FILES   WHERE VENDOR_PRICING_FILE_ID = ?', [req.body.file_id]);
  const path = './uploads/'+req.body.file_name;  // Replace with the path to your file

    fs.unlink(path, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return res.status(200).json({ success: false, message: `Something went wrong` });
      }
      console.log('File deleted successfully');
      return res.status(200).json({ success: true, message: `File has been deleted` });
    });

}