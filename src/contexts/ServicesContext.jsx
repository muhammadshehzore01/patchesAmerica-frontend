// //project/frontend/src/contexts/ServicesContext.jsx
// "use client";

// import { createContext, useContext, useState, useEffect } from "react";
// import { fetchJson } from "@/lib/api";

// const ServicesContext = createContext({});

// export const ServicesProvider = ({ children }) => {
//   const [services, setServices] = useState([]);
//   const [sliders, setSliders] = useState([]);
//   const [blogs, setBlogs] = useState([]);
//   const [hero, setHero] = useState({});
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await fetchJson("/home/");
//         setServices(data.services || []);
//         setSliders(data.sliders || []);
//         setBlogs(data.blogs || []);
//         setHero(data.hero || {});
//       } catch (err) {
//         console.error("Failed to fetch home data", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <ServicesContext.Provider value={{ services, sliders, blogs, hero, isLoading }}>
//       {children}
//     </ServicesContext.Provider>
//   );
// };

// export const useServices = () => useContext(ServicesContext);
