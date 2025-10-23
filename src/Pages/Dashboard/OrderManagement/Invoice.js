import React, { useRef } from "react";
import { useTranslation } from 'react-i18next';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
const Invoice = ({ order }) => {
    
    const { t } = useTranslation();
    const dir = localStorage.getItem('dir');

    if (!order.order_items) {
        return <div></div>;
    }
    console.log("items", order.order_info[0]);
    let sub_total = 0;
    const address = order.order_info.address_json?JSON.parse(order.order_info.address_json): [];

    return (
        <div>

            <div  style={{ border: '1px solid #CCC', padding: '20px', backgroundColor: '#FFF' }}>
            <div className="container">
                <div className="row">
                    <div className="col-8 text-center">
                        <img src={`${process.env.PUBLIC_URL}/assets/images/Logo/car7_transparent.png`} width={100} alt="" />
                    </div>
                    <div className="col-3 text-right mt-3">
                        <span style={{ fontFamily: 'unset', fontWeight: '300', fontSize: '38px' }}>Invoice</span>
                    </div>
                </div>

                <div className="row" style={{ fontSize: '12px' }}>
                    <div className="col-8">
                        <p style={{ fontFamily: "arial" }}>
                            <i>
                                51 5th St - Umm Ramool<br />
                                Dubai - United Arab Emirates<br />
                                Phone: +971 800442522
                            </i>
                        </p>
                    </div>

                    <div className="col-4 text-justify">
                        <b>{address.first_name} {address.last_name}</b>
                        <p className="xw-50" style={{ fontFamily: "arial" }}>
                            <i>
                                {address.complete_address} <br />{address.Street}
                                {address.city} - {address.country} <br />
                                {address.mobile_number_1} <br /> {address.contact_email}
                            </i>
                        </p>
                    </div>
                </div>

                <div className="row mt-3" style={{ fontSize: '12px' }}>
                    <div className="col-12">
                        <table style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }} className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>{t("product")}</th>
                                    <th>{t("quantity")}</th>
                                    <th>{t("price")}</th>
                                    <th>{t("total")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.order_items.map((item) => {
                                    sub_total += item.part_qty * item.part_price;
                                    return (
                                        <tr key={item.item_number}>
                                            <td>
                                                {item.item_title}<br />
                                                <small>{item.item_number}</small>
                                            </td>
                                            <td>{item.item_qty}</td>
                                            <td>{item.item_display_price}</td>
                                            <td>{(item.item_qty * Number(item.item_price)).toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="row mt-3" style={{ fontSize: '12px' }}>
                    <div className="col-6" style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
                        {/* <p>{t("thank_you_for_your_order")}</p> */}
                    </div>

                    <div className="col-6 text-right">
                        <table style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }} className="table table-bordered table-striped" dir={dir}>
                            <thead>
                                <tr>
                                    <th colSpan={2} style={{ textAlign: 'center' }}>{t('order_details')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{t("sub_total")}</td>
                                    <td style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>: {order.order_info[0].sub_total}</td>
                                </tr>
                                <tr>
                                    <td>{t("shipping_charges")}</td>
                                    <td style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>: {order.order_info[0].shipping_charges}</td>
                                </tr>
                                {order.order_info[0].discounted_amount > 0 && (
                                    <tr>
                                        <td>{t("total_saving")}</td>
                                        <td style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>: {order.order_info[0].discounted_amount.toFixed(2)}</td>
                                    </tr>
                                )}
                                <tr>
                                    <td>{t("payment_method")}</td>
                                    <td style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>: {order.order_info[0].payment_method}</td>
                                </tr>
                                <tr>
                                    <th>{t("grand_total")}</th>
                                    <th style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>: {order.order_info[0].grand_total}</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <center><p style={{ fontSize: '12px' }}>Powered by Ghayar LLC</p></center>
            </div>
        </div>


        </div>
    );
};

export default Invoice;
