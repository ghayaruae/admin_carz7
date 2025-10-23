<div className="card-body">




<form  onSubmit={this.handleSubmit} >
    <div className="row gy-4">

    <div>
<label htmlFor="formFile" className="form-label">Select Coupon Image</label>
<input className="form-control" type="file" id="formFile" aria-describedby="inputGroupFileAddon04"  aria-label="Upload" onChange={this.handleFileChange}/>
</div>

        <div className="col-xxl-3 col-md-6">
            <TextBox type='text' id='coupon_title_en' name='coupon_title_en' label='Coupon Title' hint='Enter Coupon Title' value={this.state.coupon_title_en} change={this.handleInputChange} />
        </div>

        <div className="col-xxl-3 col-md-6">
            <TextBox type='text' id='coupon_type' name='coupon_type' label='Coupon Type' hint='Enter Coupon Type' value={this.state.coupon_type} change={this.handleInputChange} />
        </div>

        <div className="col-xxl-3 col-md-6">
            <TextBox type='text' id='coupon_code' name='coupon_code' label='Coupon Code' hint='Enter Coupon Code' value={this.state.coupon_code} change={this.handleInputChange} />
        </div>


        <div className="col-xxl-3 col-md-6">
            <TextBox type='number' id='coupon_value' name='coupon_value' label='Coupon Value' hint='Enter Coupon Value' value={this.state.coupon_value} change={this.handleInputChange} />
        </div>

        <div className="col-xxl-3 col-md-6">
            <TextBox type='number' id='min_purchase_amount' name='min_purchase_amount' label='Minimum Purchase Amount' hint='Enter Minimum Purchase Amount' value={this.state.min_purchase_amount} change={this.handleInputChange} />
        </div>
        <div className="col-xxl-3 col-md-6">
            <TextBox type='text' id='coupon_expiry' name='coupon_expiry' label='Coupon Expiry' hint='Enter date in YYYY-MM-DD format' value={this.state.coupon_expiry} change={this.handleInputChange} />
        </div>

        <div className="col-xxl-3 col-md-12">
            <TextArea type='text' id='coupon_short_description' name='coupon_short_description' label='Coupon Short Description' hint='Enter Short Description' value={this.state.coupon_short_description} change={this.handleInputChange} />
        </div>
        {/*  <div className="col-xxl-3 col-md-12">
<CKEditor
editor={ ClassicEditor }

data={this.state.editorData}
onReady={ editor => {
// You can store the "editor" and use when it is needed.
// console.log( 'Editor is ready to use!', editor );
} }
onChange={this.handleEditorChange}
onBlur={ ( event, editor ) => {
// console.log( 'Blur.', editor );
} }
onFocus={ ( event, editor ) => {
// console.log( 'Focus.', editor );
} }
/>
</div> */}

        {/*  <div className="col-xxl-3 col-md-6">
<TextBox type='text' id='program_duration' name='program_duration' label='Program Duration (Days)' hint='Enter Program Duration (In Days)' value={this.state.program_duration} change={this.handleInputChange}/>
</div>
<div className="col-xxl-3 col-md-6">
<TextBox type='text' id='program_fees' name='program_fees' label='Program Fees' hint='Enter Program Fees' value={this.state.program_fees} change={this.handleInputChange}/>
</div> */}

        <div className="col-xxl-3 col-md-6" style={{ display: 'none' }}>
            <TextBox type='text' readyonly="true" id='program_slug' name='program_slug' label='Program Slug' hint='Enter Slug' value={this.state.program_slug} change={this.handleInputChange} />
        </div>
        {/* <div className="col-xxl-3 col-md-6">
{
this.props.params.master_program_id? <SubmitBtn icon={`ri-save-line`} text={`Update`} type={`primary`} status={this.state.status}/>:  <SubmitBtn text={`Save`} type={`primary`} icon={`ri-save-line`} />

}
//  ri-coupon-3-line
</div> */}



        <div className="col-xxl-3 col-md-6">


            <button type="submit" className="btn btn-success btn-lg btn-label waves-effect right waves-light" data-nexttab="v-pills-payment-tab" data-bs-toggle="modal" data-bs-target="#couponAreYouSure" disabled={!coupon_title_en || !coupon_type || !coupon_code || !coupon_value || !min_purchase_amount || !coupon_expiry ? true : false}><i className="ri-coupon-3-line label-icon align-middle fs-16 ms-2"></i> Generate Coupon</button>

        </div>





    </div>
</form>
</div>



handleSubmit = (event) => {

    event.preventDefault();
    const { apiURL } = this.context;
    const { token } = this.context;

    const formData = {
        editorData: this.state.editorData,
        master_program_id: this.state.master_program_id,
        coupon_code: this.state.coupon_code,
        offer_coupon_id : this.state.offer_coupon_id,
        coupon_type: this.state.coupon_type,
        coupon_title_en: this.state.coupon_title_en,
        min_purchase_amount: this.state.min_purchase_amount,
        coupon_expiry: this.state.coupon_expiry,
        coupon_short_description: this.state.coupon_short_description,
        coupon_value: this.state.coupon_value,
        
        
        program_short_description: this.state.program_short_description,
        program_long_description: this.state.program_long_description,
        program_duration: this.state.program_duration,
        program_document: this.state.program_document,
        program_fees: this.state.program_fees,
        program_type: this.state.program_type,
        program_picture: this.state.program_picture,
        program_slug: this.state.program_slug
    };
    const headers = {
        'token': `${token}`,
        'Content-Type': 'application/json', // Set the content type to JSON if needed
    };
    console.log(formData);
    this.setState({ status: true });
    axios
        .post(`${apiURL}Masters/CreateProgram`, formData, { headers })
        .then((response) => {
            // Handle the API response here

            if (response.data.success === true) {
                if (!this.props.params.master_program_id) {
                    this.setState((prevState) => ({
                        editorData: '',
                        master_program_id: '',
                        offer_coupon_id : '',
                        coupon_code: '',
                        coupon_type: '',
                        coupon_title_en: '',
                        min_purchase_amount: '',
                        coupon_value: '',
                        coupon_expiry: '',
                        coupon_short_description: '',

                        program_short_description: '',
                        program_long_description: '',
                        program_duration: '',
                        program_document: '',
                        program_fees: '',
                        program_type: '',
                        program_picture: '',
                        program_slug: '',
                        status: false
                    }));
                } else {
                    this.setState({ status: false });
                }
                Swal.fire({
                    title: '<strong>Success</strong>',
                    html: response.data.message,
                    icon: 'success'
                })
            } else {
                Swal.fire({
                    title: '<strong>Error</strong>',
                    html: response.data.message,
                    icon: 'error'
                })
            }
            console.log('API Response:', JSON.stringify(response.data.success));
        })
        .catch((error) => {
            // Handle any errors that occur during the request
            // console.error('API Error:', error);
            // Swal.fire({
            //     title: <strong>Error</strong>,
            //     html: error,
            //     icon: 'error'
            //   })
        });

};



handleGenerateCoupon = async () => {
        
    const { apiURL } = this.context;
    const { token } = this.context;

    const formData = new FormData();
    formData.append('min_purchase_amount', this.state.min_purchase_amount);
    formData.append('coupon_type', this.state.coupon_type);
    formData.append('coupon_code', this.state.coupon_code);
    formData.append('coupon_value', this.state.coupon_value);
    formData.append('coupon_expiry', this.state.coupon_expiry);
    formData.append('coupon_title_en', this.state.coupon_title_en);
    formData.append('coupon_description_en', this.state.coupon_short_description);
    formData.append('lang', 'en');
    formData.append('coupon_img', this.state.selectedFile);


   /*  const formData1 = new URLSearchParams({
        coupon_type: this.state.coupon_type,
        coupon_title_en: this.state.coupon_title_en,
        coupon_code: this.state.coupon_code,
        offer_coupon_id : this.state.offer_coupon_id,
        coupon_value: this.state.coupon_value,
        min_purchase_amount: this.state.min_purchase_amount,
        coupon_expiry: this.state.coupon_expiry,
        // coupon_short_description : this.state.coupon_short_description,


        lang: 'en',
    }); */

    try {

        const response = await axios.post(`${apiURL}Offers/GenerateCoupon`, formData, {
            headers: {
                // 'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Type': 'multipart/form-data',
            },

            // params : formData
        });
        this.setState({ isLoading: false })
        console.log('data :', response.data);

        if (response.data.success === true) {

            this.setState({
                showModal: true

            })
            console.log('posted successfully');
            Swal.fire({
                title: `<strong text-color-success>${response.data.success === true ? 'Success' : 'Failed'}</strong>`,
                text: response.data.message,
                icon: response.data.success === true ? 'success' : 'error'
            })


        }

    }
    catch (error) {
        Swal.fire({
            title: <strong>Error</strong>,
            html: error,
            icon: 'error'
        })
    }


}
