import React, { useState, useEffect } from 'react'
import AdminSideBar from '../../../components/AdminSideBar'
import { Link,  useNavigate } from 'react-router-dom'
import axios from 'axios';

const CatProfileCreate = () => {
    const url = `https://whiskerwatch-0j6g.onrender.com`;
    

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [sterilization_status, setSterilizationStatus] = useState('');
    const [description, setDescription] = useState('');

    const [catImage, setCatImage] = useState([]);
    const [catImagePreview, setCatImagePreview] = useState([]);

    const navigate = useNavigate();


    const catCreate = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(`${url}/cat/create`, {
                name, age, gender, sterilization_status, description
            });
            console.log('Signup response:', response.data);

            if (response.status === 201 || response.status === 200) {
                const cat_id = response.data.cat_id;
                console.log('Cat profile created: ', response.data);
                console.log(cat_id)

                await handleUploadImages(cat_id);
                navigate(`/catprofileproperty/${response.data.cat_id}`);
            }   

        } catch(err) {
            console.error('Error creating cat profile:', err);
        }
    }
    


    // UPLOADS & DISPLAYS IMAGE TO THE FRONTEND
    // NOT YET UPLOADED TO DATABASE
    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);

        const newFiles = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setCatImagePreview((prev) => [...prev, ...newFiles])
    }

    const handleDeleteImage = () => {
        setCatImagePreview([]);
    };


    // HANDLES UPLOADING OF NEW IMAGE UPON CAT PROFILE CREATION
    const handleUploadImages = async (cat_id) => {
        try {
            const formData = new FormData();

            catImagePreview.forEach(({file}) => {
                formData.append('images', file);
            });

            const response = await axios.post(
                `${url}/cat/uploadcatimages/${cat_id}`,
                formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                }
            );

            if (response.status === 200) {
                console.log('Image uploaded successfully!')
                setCatImagePreview([])
                
            } 
        } catch(err) {
            console.error('Image upload failed: ', err.response?.data || err.message);
        }
    }



    return (
        <div className='relative flex flex-col h-screen'>
                <div className='flex flex-row w-full overflow-x-hidden'>
                    <AdminSideBar className='max-w-[400px]'/>

                    <div className='relative flex flex-col w-full items-center p-10 min-h-screen gap-3 overflow-y-scroll'>
                        <div className='xl:hidden lg:hidden flex flex-col justify-center items-center h-screen w-full gap-3 rounded-[15px]'>
                            <label className='text-2xl text-[#2F2F2F] text-center'>Unable to access this page</label>
                            <label className='text-[#8f8f8f] text-center'>You can access the page on larger screen size such as desktop/laptop screens</label>
                        </div>

                        <div className='hidden xl:flex lg:flex w-full items-center justify-between'>
                            <label className='text-[26px] font-bold text-[#2F2F2F] pl-2'> CREATE CAT PROFILE </label>
                        </div>
                        
                        <form onSubmit={catCreate} className='hidden xl:flex lg:flex flex-col gap-4 w-full h-auto bg-[#FFF] p-7 rounded-[20px]'>
                            {/* MAIN CONTENT OF CAT PROPERTY */}
                            <div className='flex flex-row justify-between pb-2 border-b-1 border-b-[#CFCFCF]'>
                                <div className='flex flex-col'>
                                    <label className='text-[px] text-[#595959]'>Name</label>
                                    <input type="text" placeholder='Add name' required value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className='p-2 text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold'/>
                                </div>
                            </div>

                            {/* Age/Gender/Sterilization Status/Adoption Status */}
                            <div className='flex flex-row justify-between gap-3 w-full '>
                                <div className='flex flex-col gap-1 w-full'>
                                    <label className='text-[16px] text-[#595959]'>Age</label>
                                    <input type="number" placeholder='Input Age here' required 
                                    value={age} onChange={(e) => setAge(Number(e.target.value))}
                                    className='appearance-none p-2 text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold'/>
                                </div>
                                <div className='flex flex-col gap-1 w-full'>
                                    <label className='text-[16px] text-[#595959]'>Gender</label>
                                    <select value={gender} onChange={(e) => setGender(e.target.value)}
                                    className='p-[10px] text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold text-[#2F2F2F]'>
                                        <option hidden>Select gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className='flex flex-col gap-1 w-full'>
                                    <label className='text-[16px] text-[#595959]'>Sterilization Status</label>
                                    <select value={sterilization_status} onChange={(e) => setSterilizationStatus(e.target.value)} required
                                    className='p-[10px] text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold text-[#2F2F2F]'>
                                        <option hidden>Select status</option>
                                        <option value="Intact">Intact</option>
                                        <option value="Neutered">Neutered</option>
                                        <option value="Spayed">Spayed</option>
                                    </select>
                                </div>

                                {/* <div className='flex flex-col gap-1 w-full'>
                                    <label className='text-[16px] text-[#595959]'>Adoption Status</label>
                                    <select  value={adoption_status} onChange={(e) => setAdoptionStatus(e.target.value)}
                                    className='p-[10px] text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold text-[#2F2F2F]'>
                                        <option hidden>Select status</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div> */}
                            </div>

                            {/* CAT DESCRIPTION */}
                            <div className='hidden xl:flex lg:flex flex-col'>
                                <label className='text-[#595959] font-bold'>Description</label>
                                <textarea name="" id="" rows={5} className='border-2 border-[#CFCFCF] resize-none rounded-[15px] p-2'
                                placeholder='Describe the cat here' value={description} 
                                onChange={(e) => setDescription(e.target.value)} required></textarea>
                            </div>
                            
                            <div className='hidden xl:flex lg:flex flex-col w-full gap-2 p-5 rounded-[10px] border-1 border-[#a3a3a3] bg-[#FDF5D8]'>
                                <div className='flex w-full gap-2 justify-between border-b-1 border-b-[#595959] pb-2'>
                                    <div className='flex gap-4 items-center'>
                                        <label className='text-[18px] text-[#2F2F2F] font-bold'>UPLOAD NEW IMAGE</label>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <button className={`${!catImagePreview[0] ? 'hidden' : 'flex'} p-2 pl-4 pr-4 w-auto h-auto bg-[#DC8801] text-[#FFF] rounded-[25px] cursor-pointer active:bg-[#2F2F2F]`} type='button' onClick={() => handleDeleteImage()}>Reset</button>
                                        <label htmlFor="catImageUpload"
                                        className='p-2 pl-4 pr-4 w-auto h-auto bg-[#2F2F2F] text-[#FFF] rounded-[25px] cursor-pointer hover:bg-[#595959] active:bg-[#2F2F2F]'>
                                            Add Image
                                            <input type="file" accept='image/*' id="catImageUpload" onChange={handleImageChange} className='hidden' multiple/>
                                        </label>
                                    </div>
                                    
                                </div>
                                <div className='grid grid-cols-5 gap-1 w-full min-h-[200px]'>
                                    {catImagePreview.map((img, index) => (
                                        <div key={index} className='relative flex items-center bg-[#595959] max-w-[250px] h-[250px] rounded-[10px] overflow-hidden'>
                                            {/* <button type='button' 
                                            onClick={() => handleDeleteImage(img)} className='absolute top-2 right-2 p-1 pl-4 pr-4 bg-[#FFF] text-[#2F2F2F] font-bold rounded-[10px] cursor-pointer active:bg-[#CFCFCF]'>Delete</button> */}
                                            <img src={img.preview} alt={`uploaded-${index}`} className="w-full h-full object-cover"/> 
                                        </div> 
                                    ))}
                                </div>
                            </div>


                            <div className='hidden xl:flex lg:flex justify-end items-center gap-2'>
                                <button type='submit' className='p-2 pl-4 pr-4 bg-[#B5C04A] text-[#FFF] font-bold w-auto rounded-[15px] hover:bg-[#C2CB6A] active:bg-[#DC8801]'>
                                Save Changes
                                </button>
                                <Link to='/admincatprofile' className='p-2 pl-4 pr-4 bg-[#DC8801] text-[#FFF] font-bold w-auto rounded-[15px] hover:bg-[#FFB235] active:bg-[#DC8801]'>Cancel</Link>
                            </div>
                        </form>
                    
                    </div>
                    
                </div>
                
            </div>
    )
}

export default CatProfileCreate