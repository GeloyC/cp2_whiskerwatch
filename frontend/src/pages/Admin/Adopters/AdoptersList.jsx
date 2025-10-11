import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSideBar from '../../../components/AdminSideBar';
import { useSession } from '../../../context/SessionContext';
import axios from 'axios';

const AdoptersList = () => {
  const url = `https://whiskerwatch-0j6g.onrender.com`;
    
  const { user, logout, loading: sessionLoading } = useSession();
  const [adopters, setAdopters] = useState([]);

  useEffect(() => {
    const fetchAdopter = async () => {
      try {
        const response = await axios.get(`${url}/admin/adopters`);
        console.log('Adopters response:', response.data);
        console.log('Adopters response:', JSON.stringify(response.data, null, 2));
        setAdopters(response.data);

        
      } catch (err) {
        console.error('Error fetching adopter data: ', err.response?.data || err.message);
      }
    };
    fetchAdopter();
  }, []);

  // const handleUploadCertificate = async (e, adoptee) => {
  //   const file = e.target.files[0];
  //   if (!file || !file.name) {
  //     console.warn('No file selected or invalid file object.');
  //     return;
  //   }

  //   // Safely extract file extension
  //   const extension = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : '';
  //   const filename = `Certificate_${adoptee.adopter}`;

  //   const certificateForm = new FormData();
  //   certificateForm.append('certificate', file, filename);
  //   certificateForm.append('adoption_id', adoptee.adoption_id);

  //   try {
  //     const response = await axios.post(`${url}/admin/upload_certificate/:${adoptee.adoption_id}`, certificateForm, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     // Update the adopter state with the new certificate URL
  //     const updatedAdopters = adopters.map((a) =>
  //       a.adoption_id === adoptee.adoption_id ? { ...a, certificate: response.data.certificateUrl } : a
  //     );
  //     setAdopters(updatedAdopters);
  //   } catch (error) {
  //     console.error('Upload failed:', error.response?.data || error.message);
  //     alert('Failed to upload certificate. Please try again.');
  //   }
  // };

  // const handleUploadCertificate = async (e, adoptee) => {
  //   const file = e.target.files?.[0];
  //   if (!file || !file.name) {
  //     console.warn('No file selected or invalid file object.');
  //     return;
  //   }

  //   const extension = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : '';
  //   const filename = `Certificate_${adoptee.adopter.replace(/\s+/g, '_')}_${adoptee.adoption_id}${extension}`;

  //   const certificateForm = new FormData();
  //   certificateForm.append('certificate', file, filename);
  //   certificateForm.append('adopter_id', adoptee.adopter_id); // Use adopter_id if available

  //   try {
  //     const response = await axios.post(`${url}/admin/upload_certificate`, certificateForm, {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     });
  //     console.log('Upload response:', response.data); // Debug
  //     const updatedAdopters = adopters.map((a) =>
  //       a.adopter_id === adoptee.adopter_id ? { ...a, certificate: response.data.certificateUrl } : a
  //     );
  //     setAdopters(updatedAdopters);
  //   } catch (error) {
  //     console.error('Upload failed:', error.response?.data || error.message);
  //     alert('Failed to upload certificate. Please try again.');
  //   }
  // };


//   const handleUploadCertificate = async (e, adoptee) => {
//     const file = e.target.files?.[0];
//     if (!file || !file.name) {
//         console.warn('No file selected or invalid file object.');
//         alert('Please select a valid file (jpg, png, or pdf).');
//         return;
//     }

//     // Validate file type
//     const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
//     if (!validTypes.includes(file.type)) {
//         console.warn('Invalid file type:', file.type);
//         alert('Please select a jpg, png, or pdf file.');
//         return;
//     }

//     if (!adoptee.adoption_id ) {
//         console.error('Adopter ID is missing:', adoptee);
//         alert('Adopter ID is missing. Please try again.');
//         return;
//     }

//     const formData = new FormData();
//     const filename = `Certificate_${adoptee.adopter.replace(/\s+/g, '_')}_${adoptee.adoption_id }${file.name.slice(file.name.lastIndexOf('.'))}`;
//     formData.append('certificate', file, filename);
//     formData.append('adopter_id', adoptee.adoption_id );

//     try {
//         console.log('Uploading certificate for:', { adoption_id : adoptee.adoption_id , filename });
//         const response = await axios.post(`${url}/admin/upload_certificate`, formData, {
//             headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         console.log('Upload response:', response.data);

//         // Update adopters state
//         const updatedAdopters = adopters.map((a) =>
//             a.adoption_id  === adoptee.adoption_id  ? { ...a, certificate: response.data.certificateUrl } : a
//         );
//         setAdopters(updatedAdopters);

//         alert('Certificate uploaded successfully!');

//         // Optional: Refresh adopters list like fetchCatImage()
//         // await fetchAdopters(); // Uncomment if you have a fetchAdopters function
//     } catch (error) {
//         console.error('Upload failed:', error.response?.data || error.message);
//         alert(`Failed to upload certificate: ${error.response?.data?.error || 'Unknown error'}`);
//     }
// };


const handleUploadCertificate = async (e, adoptee) => {
  const file = e.target.files?.[0];
  if (!file) {
    alert("Please select a file.");
    return;
  }

  if (file.type !== "image/png") {
    alert("Only PNG files are allowed!");
    return;
  }

  const filename = `Certificate_${
    adoptee.adopter ? adoptee.adopter.replace(/\s+/g, '_') : 'unknown'
  }_${adoptee.adoption_id}.png`;


  const formData = new FormData();
  formData.append( "certificate", file,filename);
  formData.append("adoption_id", adoptee.adoption_id);

  try {
    const response = await axios.post(
      "https://whiskerwatch-0j6g.onrender.com/admin/upload_certificate",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    console.log('Upload response:', response.data);

    // Update local state
    // setAdopters((prev) =>
    //   prev.map((a) =>
    //     a.adoption_id === adoptee.adoption_id
    //       ? { ...a, certificate: response.data.certificateUrl }
    //       : a
    //   )
    // );

    alert("Certificate uploaded successfully!");
  } catch (err) {
    console.error("Upload failed:", err.response?.data || err.message);
    alert(`Upload failed: ${err.response?.data?.error || "Unknown error"}`);
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
          </div>

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
                    {adoptee.certificate ? (
                      <a
                        href={adoptee.certificate}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center justify-between self-start gap-3 p-1 pl-4 pr-4 bg-[#FDF5D8] text-[#2F2F2F] rounded-[10px] hover:underline border-dashed border-2 border-[#595959]'
                      >
                        View Certificate
                        <div className='w-[25px] h-auto'>
                          <img src="/assets/icons/document-black.png" alt="" />
                        </div>
                      </a>
                    ) : (
                      <label className='p-1 pl-4 pr-4 bg-[#FDF5D8] text-[#DC8801] rounded-[10px]'>No Certificate</label>
                    )}

                    {!adoptee.certificate && (
                      <label
                        htmlFor={`adoption_certificate_${adoptee.adoption_id}`}
                        className='w-[25px] h-[25px] p-2 bg-[#2F2F2F] rounded-[15px] cursor-pointer hover:bg-[#595959]'
                      >
                        <input
                          type="file"
                          accept="image/png"
                          id={`adoption_certificate_${adoptee.adoption_id}`}
                          hidden
                          onChange={(e) => handleUploadCertificate(e, adoptee)}
                        />
                        <img src="/assets/icons/add-white.png" alt="" className="w-full h-full" />
                      </label>
                    )}

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdoptersList;