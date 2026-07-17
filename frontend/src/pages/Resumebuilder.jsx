import Editresume from '@/components/editresume/Editresume';
import React from 'react'
import { useParams } from 'react-router-dom';

import Presview from '../components/editresume/preview';


const Resumebuilder = () => {
  const { resumeId } = useParams();

  const [resumedata, setResumedata] = useState({
    _id: "",
    title: "",
    personal_info: {},
    personal_summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    templates: 'classic',
    accent_color: '#000000',
    public: false,
  })

  const loadExistingResume = async (resumeId) => {
    const resume = "";
    if (resume) {
      setResumedata(resume);
      document.title = `${resume.title} - myResume`;

    }
    useEffect(() => {
      if (resumeId) {
        loadExistingResume(resumeId);
      }

    }, [])
    return (
      <div>

        
      </div>
    )
  }
}

export default Resumebuilder