import { auth } from "../config/firebase";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

/*
|--------------------------------------------------------------------------
| Get Firebase ID Token
|--------------------------------------------------------------------------
*/

const getAuthToken = async () => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("You must be logged in to perform this action.");
  }

  return currentUser.getIdToken();
};

/*
|--------------------------------------------------------------------------
| Generic API Request
|--------------------------------------------------------------------------
*/

const apiRequest = async (endpoint, options = {}) => {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {

    console.log(
  "API VALIDATION ERRORS:",
  data?.errors
);
    const error = new Error(
      data?.message || "Something went wrong. Please try again."
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
};

/*
|--------------------------------------------------------------------------
| Create Resume
|--------------------------------------------------------------------------
*/

export const createResume = async (resumeData) => {
  const resumeId = crypto.randomUUID();

  const data = {
    ...resumeData,
    resumeId,
  };

  return apiRequest("/resumes", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/*
|--------------------------------------------------------------------------
| Get All Resumes
|--------------------------------------------------------------------------
*/

export const getResumes = async () => {
  return apiRequest("/resumes");
};

/*
|--------------------------------------------------------------------------
| Get Single Resume
|--------------------------------------------------------------------------
*/

export const getResume = async (resumeId) => {
  return apiRequest(`/resumes/${resumeId}`);
};

/*
|--------------------------------------------------------------------------
| Update Resume
|--------------------------------------------------------------------------
*/

export const updateResume = async (resumeId, resumeData) => {
  return apiRequest(`/resumes/${resumeId}`, {
    method: "PATCH",
    body: JSON.stringify(resumeData),
  });
};

/*
|--------------------------------------------------------------------------
| Delete Resume
|--------------------------------------------------------------------------
*/

export const deleteResume = async (resumeId) => {
  return apiRequest(`/resumes/${resumeId}`, {
    method: "DELETE",
  });
};