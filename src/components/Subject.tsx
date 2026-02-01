type SubjectProps = {
    subject:string
}

const Subject = ({subject}:SubjectProps) =>{
    return (
        <button type="button" className="btn btn-light subjectButton" disabled>{subject}</button>
    )
}

export default Subject