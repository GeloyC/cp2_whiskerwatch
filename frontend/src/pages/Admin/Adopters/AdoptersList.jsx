import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminSideBar from '../../../components/AdminSideBar'
import HeadVolunteerSideBar from '../../../components/HeadVolunteerSideBar'
import { useSession } from '../../../context/SessionContext'
import axios from 'axios'

// TODO: Certicates: After approval -- option of admin/HV to attach/upload certicate of adopter
// After adoption -- Certificate will be picked up by adopter

const AdoptersList = () => {
  const { user, logout, loading: sessionLoading } = useSession();
  const [adopters, setAdopters] = useState([]);

  // FETCH DATA FROM HERE USING AXIOS
  // TO FETCH USER DATA : adoption_id, adopter_name, contactnumber, cat_adopted 
  useEffect(() => {
    const fetchAdopter = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/adopters');
        setAdopters(response.data);
        
      } catch (err) {
        console.error('Error fetching adopter data: ', err.response?.data || err.message)
      }

    }
    fetchAdopter()
  }, []);


  const handleUploadCertificate = async (e, adoptee) => {
    const file = e.target.files?.[0];
    if (!file || !file.name) {
      console.warn('No file selected or invalid file object.');
      return;
    }
    console.log(file)

    // Safely extract file extension
    const extension = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : '';
    const filename = `Certificate_${adoptee.adopter.replace(/\s+/g, '_')}_${adoptee.adoption_id}${extension}`;

    const certificateForm = new FormData();
    certificateForm.append('certificate', file, filename);
    certificateForm.append('adoption_id', adoptee.adoption_id);

    try {
      const response = await axios.post('http://localhost:5000/admin/upload_certificate', certificateForm, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload success:', response.data);

      // Optional: refetch or update adopter state to reflect new certificate
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
    }
  };


  return (
    <div className='relative flex flex-col h-screen overflow-x-hidden'>
        <div className='flex flex-row w-full'>
          <AdminSideBar className='max-w-[400px]'/>
          
          <div className='relative flex flex-col items-center xl:p-10 lg:p-10 h-screen w-full gap-5 mx-auto'>
            <div className='xl:hidden lg:hidden flex flex-col justify-center items-center h-screen w-full gap-3 rounded-[15px]'>
                <label className='text-2xl text-[#2F2F2F] text-center'>Unable to access this page</label>
                <label className='text-[#8f8f8f] text-center'>You can access the page on larger screen size such as desktop/laptop screens</label>
            </div>

            <div className='hidden xl:flex lg:flex flex-row justify-start w-full border-b-2 border-b-[#525252]'>
              <label className='font-bold text-[24px]'>Adopters</label>
            </div>

            {/* FILTERS */}
            <div className='hidden xl:flex lg:flex flex-row justify-between w-full'>
              <form className='flex gap-2'>
                <input type="search" placeholder='Search' className='bg-[#FFF] p-2 min-w-[400px] border-1 border-[#595959] rounded-[15px]'/>
                <button className='bg-[#CFCFCF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer hover:bg-[#a3a3a3] active:bg-[#CFCFCF]'>Search</button>
              </form>


              {/* <form className='hidden xl:flex lg:flex flex-row items-center gap-2'>
                <div className='flex items-center gap-1'>
                  <label className='leading-tight'>Date</label>
                  <input type="date" name="" id="" className='bg-[#FFF] p-2 min-w-[250px] rounded-[15px] border-1 border-[#595959]'/>
                </div>
                <button className='bg-[#CFCFCF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer hover:bg-[#a3a3a3] active:bg-[#CFCFCF]'>Search</button>
              </form> */}
            </div>

            {/* CERTIFICATE */}

            <table className='hidden xl:flex lg:flex flex-col w-full gap-2'>
              <thead className='flex w-full'>
                <tr className='grid grid-cols-6 justify-items-start place-items-start w-full bg-[#DC8801] p-3 rounded-[15px] text-[#FFF]'>
                  <th>Adoption ID</th>
                  <th>Name</th>
                  <th>Adopted Cat</th>
                  <th>Date of Adoption</th>
                  <th>Contact Number</th>
                  <th>Certificate</th>
              </tr>
              </thead>
              <tbody className='flex flex-col w-full overflow-y-scroll max-h-[550px] gap-1'>
                {adopters.map((adoptee) => (
                  <tr key={adoptee.adoption_id} className='grid grid-cols-6 w-full place-items-center justify-items-start bg-[#FFF] p-2 rounded-[15px] text-[#2F2F2F] border-b-1 border-b-[#595959]'>
                    <td>{adoptee.adoption_id}</td>
                    <td>{adoptee.adopter}</td>
                    <td>{adoptee.cat_name}</td>
                    <td>{adoptee.adoption_date}</td>
                    <td>{adoptee.contactnumber}</td>
                    <td className='flex items-center justify-start gap-2'>
                      {/* Click to open certificate file on new tab: PDF FORMAT */}

                      {/* CREATE A GET REQUEST FOR THE FILE LINK ON Admin.js */}
                      {adoptee.certificate ? (
                        <a href={`http://localhost:5000/FileUploads/certificate/${adoptee.certificate}`} target='_blank' 
                        type="image/png" className='flex items-center justify-between self-start gap-3 p-1 pl-4 pr-4 bg-[#FDF5D8] text-[#2F2F2F] rounded-[10px] hover:underline border-dashed border-2 border-[#595959]'>
                        View Certificate
                        </a>
                      ) : (
                        <label className='p-1 pl-4 pr-4 bg-[#FDF5D8] text-[#DC8801] rounded-[10px]'>No Certificate</label>
                      )}

                      {!adoptee.certificate ? (
                        <label htmlFor={`adoption_certificate_${adoptee.adoption_id}`} className='w-[25px] h-[25px] object-fit p-2 bg-[#2F2F2F] rounded-[15px] cursor-pointer hover:bg-[#595959] active:bg-[#2F2F2F]'>
                          <input type="file" accept='image/jpeg, image/png' 
                          id={`adoption_certificate_${adoptee.adoption_id}`} hidden onChange={(e) => handleUploadCertificate(e, adoptee)}/>
                          <img src="/src/assets/icons/add-white.png" alt="" className='w-full h-full object-cover'/>
                        </label>
                      ) : ('')}
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>


              

          </div>
        </div>
    </div>
  )
}

export default AdoptersList