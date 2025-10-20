import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from '../components/NavigationBar';
import SideNavigation from '../components/SideNavigation';
import HeadVolunteerSideBar from '../components/HeadVolunteerSideBar';
import Footer from '../components/Footer';
import CatBot from '../components/CatBot';
import { useSession } from '../context/SessionContext';
import Whisker from '../components/Whisker';

const CatAdoption = () => {
  const url = `https://whiskerwatch-0j6g.onrender.com`;
  const { user } = useSession();
  const navigate = useNavigate();

  const [cats, setCats] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await axios.get(`${url}/cat/catlist`);
        // const formattedCats = response.data.map(cat => ({
        //   ...cat,
        //   thumbnail: cat.cloudinary_id
        //   ? cat.cloudinary_id.startsWith('http')
        //     ? cat.cloudinary_id
        //     : `https://res.cloudinary.com/dop5djsfg/image/upload/${cat.cloudinary_id}.jpg`
        //   : '/assets/default-cat.jpg',
        // }));

        const formattedCats = response.data.map(cat => {
          const ageData = calculateCatAgeFromBirthDate(cat.birthday);
          return {
            ...cat,
            thumbnail: cat.cloudinary_id
              ? cat.cloudinary_id.startsWith('http')
                ? cat.cloudinary_id
                : `https://res.cloudinary.com/dop5djsfg/image/upload/${cat.cloudinary_id}.jpg`
              : '/assets/default-cat.jpg',
            formattedCatAge: ageData.formattedCatAge,
            formattedHumanAge: ageData.formattedHumanAge,
          };
        });
        setCats(formattedCats);
      } catch (err) {
        console.error('Error fetching cat:', err);
      }
    };
    fetchCats();
  }, []);


  // Calculate cat age
  const calculateCatAgeFromBirthDate = (birthDateStr) => {
    const currentDate = new Date('2025-10-19T21:47:00-07:00'); // Example current date
    const birthDate = new Date(birthDateStr);

    // Validate
    if (isNaN(birthDate.getTime())) {
      return "Error: Invalid birth date format.";
    }
    if (birthDate > currentDate) {
      return "Error: Birth date cannot be in the future.";
    }

    // This calculates the cat age in years + months
    let totalMonths =
      (currentDate.getFullYear() - birthDate.getFullYear()) * 12 +
      (currentDate.getMonth() - birthDate.getMonth());

    if (currentDate.getDate() < birthDate.getDate()) {
      totalMonths -= 1;
    }

    const catYears = Math.floor(totalMonths / 12);
    const catMonths = totalMonths % 12;
    const catAgeInYears = catYears + catMonths / 12;


    // This calculates the cat age equivalent to human years
    const catAgeToHumanYears = (catYears) => {
      if (catYears <= 1) return catYears * 15;
      if (catYears <= 2) return 15 + (catYears - 1) * 9;
      return 24 + (catYears - 2) * 4;
    };

    const humanAgeInYears = catAgeToHumanYears(catAgeInYears);
    const humanYears = Math.floor(humanAgeInYears);
    const humanMonths = Math.round((humanAgeInYears - humanYears) * 12);

    // -------------------------------
    // 🎯 Final output (formatted)a
    // -------------------------------
    return {
      formattedCatAge: `${catYears} year${catYears !== 1 ? "s" : ""} and ${catMonths} month${catMonths !== 1 ? "s" : ""}`,
      formattedHumanAge: `${humanYears} year${humanYears !== 1 ? "s" : ""} and ${humanMonths} month${humanMonths !== 1 ? "s" : ""} in Human years`,
      catAgeInYears: parseFloat(catAgeInYears.toFixed(2)),
      humanAgeInYears: parseFloat(humanAgeInYears.toFixed(2))
    };
  };

  // const result = calculateCatAgeFromBirthDate(cats.birthday);

  // console.log(`${result.formattedCatAge} old (${result.formattedHumanAge})`);



  const filteredNames = cats.filter((cat) => {
    const nameMatches = cat.name?.toLowerCase().includes(searchInput.toLowerCase());
    const genderMatches = genderFilter === 'all' || cat.gender === genderFilter;
    return nameMatches && genderMatches;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <CatBot
        message={
          "There's a cat out there dreaming of a home like yours. When you adopt, you're not just saving a life — you're gaining a loyal companion who'll fill your days with love, laughter, and purrs."
        }
      />
      <NavigationBar />
      <Whisker />
      <main className="flex-grow flex flex-col items-center justify-start py-10 px-10 xl:px-30 lg:px-20 md:px-10">
        <div className="flex flex-col gap-5 w-full h-full">
          {/* ALL CONTENTS HERE */}
          <div className="flex flex-col xl:flex-row lg:flex-row md:flex-col items-center gap-2 w-full">
            <label className="w-full font-bold text-center xl:text-left lg:text-left md:text-center">
              Filter the list of Cats
            </label>
            <div className="flex items-center w-full">
              <input
                type="search"
                placeholder="Search for name"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-[#FFF] p-2 border-[#A3A3A3] border rounded-[10px]"
              />
            </div>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full bg-[#FFF] p-2 border-[#A3A3A3] border rounded-[10px]"
            >
              <option value="all">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2 place-items-start gap-2">
            {filteredNames.map((cat) => (
              <div
                key={cat.cat_id}
                onClick={() => navigate(`/catprofile/${cat.cat_id}`)}
                className="w-full w-[300px] h-auto grid grid-cols-2 lg:grid-cols-none lg:grid-rows-[auto_auto] md:grid-cols-none md:grid-rows-[auto_auto] border-2 border-white overflow-hidden rounded-[25px] bg-white hover:shadow-lg hover:border-[#889132] hover:scale-103 active:scale-95 transition-all duration-100"
              >
                <div className="overflow-hidden xl:rounded-t-[25px] lg:rounded-t-[25px] w-full h-[250px]">
                  <img
                    src={cat.thumbnail}
                    alt={`cat image ${cat.cat_id}`}
                    className="overflow-hidden w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center w-full p-3">
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-rows-2">
                      <label className="flex items-end gap-2 text-[30px] font-bold text-[#889132]">
                        {cat.name}
                      </label>
                      <div className="flex flex-row flex-wrap gap-3 border-dashed border-b-2 border-b-[#B5C04A]">
                        <label className="flex flex-row items-center font-bold text-[12px] gap-[5px]">
                          <div className="flex items-center justify-center w-[20px] h-auto">
                            <img
                              src="/assets/icons/genders-black.png"
                              alt="gender sign"
                              className="object-cover"
                            />
                          </div>
                          {cat.gender}
                        </label>
                        <label className="flex flex-row items-center font-bold text-[12px] gap-[5px]">
                          <div className="flex items-center justify-center w-[15px] h-auto">
                            <img src="/assets/icons/hourglass.png" alt="hourglass" />
                          </div>
                          {cat.age} years old
                          {cat.formattedCatAge}
                        </label>
                      </div>
                    </div>
                    <textarea
                      rows={5}
                      disabled
                      className="resize-none pl-2 text-[12px] xl:text-[13px] lg:text-[13px] md:text-[13px] h-[40px] text-[#555555] leading-tight break-words whitespace-normal"
                    >
                      {cat.description.length > 50 ? cat.description.slice(0, 60) + '...' : cat.description}
                    </textarea>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CatAdoption;