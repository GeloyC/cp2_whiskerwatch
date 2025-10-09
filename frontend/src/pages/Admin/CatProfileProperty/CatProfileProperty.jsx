import React, {useState, useEffect} from 'react'
import AdminSideBar from '../../../components/AdminSideBar'
import { Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';


const CatProfileProperty = () => {
    const url = `https://whiskerwatch-0j6g.onrender.com`;
    

    const location = useLocation();
    const [catprofile, setCatprofile] = useState({
        cat_id: '',
        name: '',
        gender: 'Male',
        age: '',
        adoption_status: 'Available',
        sterilization_status: 'Intact',
        description: '',
        date_created: '',
        date_updated: ''
    });
    const [adoptionHistory, setAdoptionHistory] = useState([]);

    const [originalCatprofile, setOriginalCatprofile] = useState(null);

    const { cat_id } = useParams();

    const [catImage, setCatImage] = useState([]);
    const [catImagePreview, setCatImagePreview] = useState([]);
    const [uploaderVisible, setUploaderVisible] = useState(false);
    
    // Fetch data of cat profile and display
    useEffect(() => {
        if (!cat_id) return;

        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${url}/cat/catprofile/${cat_id}`);
                console.log(response.data.date_created)
                setCatprofile(response.data)
                setOriginalCatprofile(response.data)

            } catch(err) {
                console.error('Error fetching cat:', err);
            }
        }
        fetchProfile()
        
    }, [cat_id]); 


    useEffect(() => {
        if (!cat_id) return;

        const fetchAdoptionHistory = async () => {
            try {
                const response = await axios.get(`${url}/cat/adoption_history/${cat_id}`);
                console.log(response.data)
                setAdoptionHistory(response.data);
            } catch(err) {
                console.error('Error fetching adoption history:', err);
            }
        };

        fetchAdoptionHistory();
    }, [cat_id]);


    // CHECKS FOR CHANGES ON THE DATA
    const isProfileModified = () => {
        return JSON.stringify(catprofile) !== JSON.stringify(originalCatprofile);
    };

    // HANDLES THE UPDATE OF DATA ONCE SAVE BUTTON CLICKED 
    const handleCatProfileUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.patch(`${url}/cat/update/${cat_id}`, {
                name: catprofile.name,
                gender: catprofile.gender,
                age: catprofile.age,
                adoption_status: catprofile.adoption_status,
                sterilization_status: catprofile.sterilization_status,
                description: catprofile.description
            });

            console.log('Update success:', response.data);

            console.log('Sending:', {
                name: catprofile.name,
                gender: catprofile.gender,
                age: catprofile.age,
                adoption_status: catprofile.adoption_status,
                sterilization_status: catprofile.sterilization_status,
                description: catprofile.description
            });

            window.location.reload();
        } catch(err) {
            console.error('Update failed:', err.response?.data || err.message);
        }
    }

    

    // DISPLAYS AN IMAGE SELECTED
    // NOT YET UPLOADED TO DATABASE UNLESS SAVE BUTTON IS CLICKED
    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);

        const newFiles = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setCatImagePreview((prev) => [...prev, ...newFiles])
    }


    const handleImageUploaderWindow = () => {
        if (uploaderVisible) {
            // Closing the uploader — clear preview images
            setCatImagePreview([]);
        }
        setUploaderVisible(!uploaderVisible);
    }


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
                setUploaderVisible(false);  
                await fetchCatImage();
            } 
        } catch(err) {
            console.error('Image upload failed: ', err.response?.data || err.message);
        }
    }

    // Fetching Image data of the CAT
    const fetchCatImage = async () => {
        try {
            const response = await axios.get(`${url}/cat/image/${cat_id}`);

            const imageUrls = response.data.map(filename => ({
                filename: filename,
                url: `${url}/FileUploads/cats/${filename}`
            }));

            setCatImage(imageUrls);
        } catch(err) {
            console.error('Error fetching cat Image:', err);
        }
    }

    const handleDeleteImage = async (filename) => {
    try {
        await axios.delete(`${url}/cat/image/${filename}`);
            console.log(`Deleted image: ${filename}`);
            fetchCatImage(); // Refresh the image list

        } catch (err) {
            console.error('Failed to delete image:', err);
        }
    };

    

    useEffect(() => {
        if (!cat_id) return;
        fetchCatImage(); 
    }, [cat_id]); 



    return (
        <div className='relative flex flex-col h-screen'>
            <div className='flex flex-row w-full overflow-x-hidden'>
                <AdminSideBar className='max-w-[400px]'/>

                <div className='relative flex flex-col items-center xl:p-10 lg:p-10 min-h-screen gap-3 w-full overflow-y-scroll'>
                    <div className='xl:hidden lg:hidden flex flex-col justify-center items-center h-screen w-full gap-3 rounded-[15px]'>
                        <label className='text-2xl text-[#2F2F2F] text-center'>Unable to access this page</label>
                        <label className='text-[#8f8f8f] text-center'>You can access the page on larger screen size such as desktop/laptop screens</label>
                    </div>

                    <div className='hidden xl:flex lg:flex w-full items-center justify-between'>
                        <label className='text-[26px] font-bold text-[#2F2F2F] pl-2'> CAT PROFILE </label>

                        <Link to="/catprofilecreate" className='flex flex-row items-center justify-center gap-3 p-3 pl-6 pr-6 bg-[#B5C04A] text-[#FFF] rounded-[15px] hover:bg-[#CFDA34] active:bg-[#B5C04A]'>Create New</Link>
                    </div>

                    {catprofile && (
                        <form onSubmit={handleCatProfileUpdate} className='hidden xl:flex lg:flex flex-col gap-4 w-full h-auto bg-[#FFF] p-7 rounded-[20px]'>
                            {/* MAIN CONTENT OF CAT PROPERTY */}
                            <div className='flex flex-row justify-end gap-6 pb-2'>
                                <div className='flex items-center gap-2'> 
                                    <label className='text-[14px]'>Date created:</label>
                                    <label className='text-[14px] font-bold'>{catprofile.date_created}</label>
                                </div>
                                <div className='flex items-center gap-2'> 
                                    <label className='text-[14px]'>Date updated:</label>
                                    <label className='text-[14px] font-bold'>{(catprofile.date_created == catprofile.date_updated) ? 'No updates' : catprofile.date_updated  }</label>
                                </div>
                            </div>
                            <div className='flex flex-row justify-between pb-2 border-b-1 border-b-[#CFCFCF]'>
                                <div className='flex flex-col'>
                                    <label className='text-[16px] text-[#595959]'>Name</label>
                                    {/* <label className='font-bold text-[#2F2F2F] text-[20px]'>{catprofile.name}</label> */}
                                    <input type="text" placeholder='Add name' className='font-bold text-[#2F2F2F] text-[20px] p-2 text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF]'
                                    value={catprofile.name || ''}
                                    onChange={(e) => setCatprofile(prev => ({...prev, name: e.target.value}))}/>
                                </div>
                                <div className='flex flex-col items-end'>
                                    <label className='text-[16px] text-[#595959]'>Cat ID</label>
                                    <label className='font-bold text-[#2F2F2F] text-[20px]'>{catprofile.cat_id}</label>
                                </div>
                            </div>

                            {/* Age/Gender/Sterilization Status/Adoption Status */}
                            <div className='flex flex-row justify-between gap-3 w-full '>
                                <div className='flex flex-col gap-1 w-full'>
                                    <label className='text-[16px] text-[#595959]'>Age</label>
                                    <input type="number" placeholder='Input Age here'
                                    value={catprofile.age || ''}
                                    onChange={(e) => setCatprofile(prev => ({...prev, age: e.target.value}))} 
                                    className='appearance-none p-2 text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold'/>
                                </div>
                                <div className='flex flex-col gap-1 w-full'>
                                    <label className='text-[16px] text-[#595959]'>Gender</label>
                                    <select value={catprofile.gender || ''}
                                    onChange={(e) => setCatprofile((prev) => ({...prev, gender: e.target.value}))}
                                    className='p-[10px] text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold text-[#2F2F2F]'>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className='flex flex-col gap-1 w-full'>
                                    <label className='text-[16px] text-[#595959]'>Sterilization Status</label>
                                    <select value={catprofile.sterilization_status || ''} 
                                    onChange={(e) => setCatprofile((prev) => ({...prev, sterilization_status: e.target.value}))}
                                    className='p-[10px] text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold text-[#2F2F2F]'>
                                        <option value="Intact">Intact</option>
                                        <option value="Neutered">Neutered</option>
                                        <option value="Spayed">Spayed</option>
                                    </select>
                                </div>

                                <div className='flex flex-col gap-1 w-full'>
                                    <label className='text-[16px] text-[#595959]'>Adoption Status</label>
                                    <select  value={catprofile.adoption_status || ''} 
                                    onChange={(e) => setCatprofile((prev) => ({...prev, adoption_status: e.target.value}))}
                                    className='p-[10px] text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold text-[#2F2F2F]'>
                                        <option value="Available">Available</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Adopted">Adopted</option>
                                    </select>
                                </div>
                            </div>

                            {/* Adoption History */}
                            <div className='hidden xl:flex lg:flex flex-col gap-1'>
                                <label className='text-[16px] text-[#595959]'>Adoption history</label>
                                {adoptionHistory.length > 0 ? (
                                    <div className='flex flex-row justify-between p-2 rounded-[10px] border-2 border-[#F2F2F2] bg-[#F2F2F2]'>
                                        <div className='flex flex-row gap-5'>
                                            <label className='text-[#595959]'>Adopter: </label>
                                            <label className='text-[#2F2F2F] font-bold'>{adoptionHistory[0].adopter}</label>
                                        </div>

                                        <div className='flex flex-row gap-5'>
                                            <label className='text-[#595959]'>Date Adopted: </label>
                                            <label className='text-[#2F2F2F] font-bold'>{adoptionHistory[0].adoption_date}</label>
                                        </div>

                                        <div className='flex flex-row gap-5'>
                                            <label className='text-[#595959]'>Contact #: </label>
                                            <label className='text-[#2F2F2F] font-bold'>{adoptionHistory[0].contactnumber}</label>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='flex flex-row justify-between p-2 rounded-[10px] border-2 border-[#F2F2F2] bg-[#F2F2F2]'>
                                        <label className='italic text-[#a3a3a3]'>{`${catprofile.name} has no adoption history.`}</label>
                                    </div>
                                )}
                            </div>

                            
                            {/* CAT DESCRIPTION */}
                            <div className='hidden xl:flex lg:flex flex-col'>
                                <label className='text-[#595959] font-bold'>Description</label>
                                <textarea name="" id="" rows={5} className='border-2 border-[#CFCFCF] resize-none rounded-[15px] p-2'
                                value={catprofile.description} 
                                onChange={(e) => setCatprofile((prev) => ({...prev, description: e.target.value}))}
                                placeholder='Describe the cat here'></textarea>
                            </div>


                            {/* Image/s */}
                            {/* THIS BLOCK DISPLAYS THE IMAGE SAVED ON DATABASE w/ DELETE FUNCTIONALITY */}
                            {!uploaderVisible && (
                                <div className='hidden xl:flex lg:flex flex-col gap-2 border-1 border-[#a3a3a3] p-3 rounded-[15px]'>
                                    {/* HEADER */}
                                    <div className='flex items-center justify-between'>
                                        <label className='text-[20px] text-[#2F2F2F] font-bold '> IMAGES </label>
                                        <button onClick={handleImageUploaderWindow} type='button' className='flex items-center gap-2 bg-[#2F2F2F] text-[#FFF] p-2 pl-4 pr-4 rounded-[25px] cursor-pointer active:bg-[#595959]'> 
                                            <div className='w-[20px] h-auto'>
                                                <img src="/assets/icons/admin-icons/setting_white.png" alt=""/>
                                            </div>
                                            Manage Images
                                        </button>
                                    </div>

                                    {/* PREVIEW IMAGE HERE */}
                                    <div className='grid grid-cols-5 gap-2 w-full'>

                                        {/* SINGLE IMAGE CONTAINER */}
                                        {catImage.map((imageURL, index) => (
                                            <div key={index} className='relative flex items-center max-w-[250px] h-[250px] rounded-[10px] overflow-hidden bg-[#CCCCCC] border-1 border-[#CCCCCC]'>
                                                <button type='button' onClick={() => handleDeleteImage(imageURL.filename)}
                                                className='absolute top-2 right-2 bg-[#DC8801] text-[#FFF] p-1 pl-2 pr-2 rounded-[15px] cursor-pointer active:bg-[#2F2F2F]'>delete</button>
                                                <img src={imageURL.url} alt={`Cat Image ${index}`} className="w-full h-full object-cover"/>
                                            </div>
                                        ))}
                                        
                                    </div>
                                </div>
                            )}


                            {/* THIS BLOCK DISPLAYS IMAGES TO UPLOAD */}
                            {uploaderVisible && (
                                <div className='hidden xl:flex lg:flex flex-col gap-2 border-1 border-[#a3a3a3] p-3 rounded-[15px]'>
                                    {/* HEADER */}
                                    <div className='flex items-center justify-between'>
                                        <label className='text-[20px] text-[#2F2F2F] font-bold '> IMAGES </label>

                                        {/* UPLOADER BUTTON */}
                                        <label htmlFor='image' className='flex items-center gap-2 bg-[#2F2F2F] text-[#FFF] p-2 pl-4 pr-4 rounded-[25px] cursor-pointer active:bg-[#595959]'> 
                                            <div className='w-[15px] h-auto'>
                                                <img src="/assets/icons/add-white.png" alt=""/>
                                            </div>
                                            <input type="file" name="image" id="image" className='hidden'
                                            onChange={handleImageChange}/>
                                            Add
                                        </label>
                                    </div>

                                    {/* PREVIEW IMAGE HERE */}
                                    {/* IF NO IMAGE IS SELECTED YET = Display the label */}
                                    {!catImagePreview || catImagePreview.length === 0 ?  
                                        <label className='hidden xl:flex lg:flex justify-center text-[#DC8801]'>Upload a new Image here.</label>
                                        :
                                        <div className='grid grid-cols-5 gap-2 w-full min-h-[250px]'>

                                            {/* SINGLE IMAGE CONTAINER */}
                                            {/* catImagePreview.map allows for multiple image to display */}
                                            {catImagePreview.map((imagePreview, index) => (
                                                <div key={index} className='relative flex items-center max-w-[250px] h-[250px] rounded-[10px] overflow-hidden'>
                                                    <img src={imagePreview.preview} alt="" className={"w-full h-full object-cover" }/>
                                                </div>
                                            ))}
                                        </div>
                                    }

                                    {/* SAVE BUTTON */}
                                    <div className='hidden xl:flex lg:flex items-center justify-end gap-1 w-full'>
                                        <button type='button' onClick={() => handleUploadImages(cat_id)} className='flex items-center justify-center gap-2 bg-[#B5C04A] text-[#FFF]  font-bold p-2 pl-4 pr-4 min-w-[80px] rounded-[25px] cursor-pointer active:bg-[#595959]'>
                                            Save
                                        </button>
                                        <button onClick={handleImageUploaderWindow} type='button' className='flex items-center gap-2 bg-[#2F2F2F] text-[#FFF] font-bold p-2 pl-4 pr-4 rounded-[25px] cursor-pointer active:bg-[#595959]'>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                    
                            {/* SAVE CHANGES FOR THE FORM EXCEPT THE IMAGES*/}
                            <div className='hidden xl:flex lg:flex justify-end'>
                                <button type='submit' 
                                    className={isProfileModified() ? 'p-2 pl-4 pr-4 bg-[#DC8801] text-[#FFF] font-bold w-auto rounded-[15px] hover:bg-[#FFB235] active:bg-[#DC8801]' : 'hidden'}>
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    )}
                </div>
                
            </div>
            
        </div>
    )
}

export default CatProfileProperty