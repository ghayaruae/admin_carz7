const TextBox = (props) => {
    return (
    <div>
        <label  htmlFor="basiInput" className="form-label">{props.label}</label>
        <input className="form-control" value={props.value} type={props.type} id={props.id} name={props.name} placeholder={props.hint} onChange={props.change}/>
    </div>
    );
}

const TextArea = (props) => {

    return (
    <div>
        <label  htmlFor="basiInput" className="form-label">{props.label}</label>
        <textarea  className="form-control"  value={props.value} type={props.type} id={props.id} name={props.name} placeholder={props.hint} onChange={props.change}/>
    </div>
    );
}
 const SubmitBtn = (props) => {
    return (
        props.status === true?<button type="button" className={`btn btn-${props.type} btn-load`}><span className="d-flex align-items-center"><span className="flex-grow-1 me-2">Please wait...</span><span className="spinner-grow flex-shrink-0" role="status"><span className="visually-hidden">Please wait...</span></span></span></button>
        :<button type="submit" className={`btn btn-${props.type}  btn-label waves-effect right waves-light float-right`}><i className={`${props.icon} label-icon align-middle fs-16 ms-2`} /> {props.text}</button>
        );
} 

export { TextBox, TextArea, SubmitBtn };