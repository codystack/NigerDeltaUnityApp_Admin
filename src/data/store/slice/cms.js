import { createSlice } from "@reduxjs/toolkit";

export const cmsSlice = createSlice({
  name: "cms",
  initialState: {
    statesData: null,
    projectsData: null,
    categoriesData: null,
    newsData: null,
    vendorsData: null,
    adsData: null,
  },
  reducers: {
    setStatesData: (state, action) => {
      state.statesData = action.payload;
    },
    setAdsData: (state, action) => {
      state.adsData = action.payload;
    },
    setVendorsData: (state, action) => {
      state.vendorsData = action.payload;
    },
    setProjectsData: (state, action) => {
      state.projectsData = action.payload;
    },
    setNewsData: (state, action) => {
      state.newsData = action.payload;
    },
    setCategoriesData: (state, action) => {
      state.categoriesData = action.payload;
    },
  },
});

export const {
  setAdsData,
  setCategoriesData,
  setNewsData,
  setProjectsData,
  setStatesData,
  setVendorsData,
} = cmsSlice.actions;

export default cmsSlice.reducer;
