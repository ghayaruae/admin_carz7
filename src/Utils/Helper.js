const OrderStatusIcons = ({status, style}) => {
    if(Number(status) === 4){
        return <i className="ri-truck-line"></i>
    }else if(Number(status) === 3) {
       
        return <i className="mdi mdi-package-variant"></i>
    }else if(Number(status) === 6) {
       
        return <i className="ri-close-line"></i>
    }else if(Number(status) === 7) {
       
        return <i className="ri-reply-line"></i>
    }else{
       
        return <i className="ri-shopping-bag-line"></i>
    }
    
}
export default OrderStatusIcons;