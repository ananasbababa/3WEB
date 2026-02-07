import { useNavigate } from "react-router-dom"

type SubjectProps = {
    subject:string
}

const Subject = ({subject}:SubjectProps) =>{
    const navigate = useNavigate()
    return (
        <button type="button" data-cy="subject-item" className="btn btn-light subjectButton" onClick={()=>{navigate("/detailed-search/subject:"+subject)}}>{subject}</button>
    )
}

export default Subject