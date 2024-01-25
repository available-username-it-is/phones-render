const Person = (props) => {
    return (
        <>
            <p>{props.name} {props.number}</p>
            <button onClick={props.removeContact}>delete</button>
        </>
    )
}

export default Person