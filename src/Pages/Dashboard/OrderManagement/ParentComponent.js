import DeliverModal from "./DeliverModal";
import OrderDetails from "./OrderDetails";
import React from "react";

class ParentComponent extends React.Component {
state = { showModal : false};

handleDeliverClick = () => {
    this.setState({showModal : true});
}

render () {
const {showModal} = this.state;
console.log('state', showModal)

return (

    <>
    <OrderDetails onDeliverClick = {this.handleDeliverClick} />
    {showModal && <DeliverModal onClose= {()=> this.setState({showModal : false})} />}
    </>
)

}

}

export default ParentComponent;