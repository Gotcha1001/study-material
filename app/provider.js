"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CourseCountContext } from "./_context/CourseCountContext";
import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";

function Provider({ children }) {
  const { user, isLoaded } = useUser();
  const [totalCourses, setTotalCourses] = useState(0);
  const [remainingCredits, setRemainingCredits] = useState(10);
  const [isUserDataSaved, setIsUserDataSaved] = useState(false);

  // Only trigger effects when Clerk has loaded user data
  useEffect(() => {
    if (isLoaded && user) {
      CheckIsNewUser();
    }
  }, [isLoaded, user]);

  // Separate effect for fetching courses to avoid race conditions
  useEffect(() => {
    if (isUserDataSaved && user) {
      fetchUserCoursesAndCredits();
    }
  }, [isUserDataSaved, user]);

  const fetchUserCoursesAndCredits = async () => {
    try {
      if (!user || !user.primaryEmailAddress?.emailAddress) {
        console.log("User data not fully loaded yet");
        return;
      }

      // Fetch user details from database
      const userResult = await db
        .select()
        .from(USER_TABLE)
        .where(eq(USER_TABLE.email, user.primaryEmailAddress.emailAddress));

      if (userResult.length === 0) {
        console.log("User not found in database");
        return;
      }

      // Fetch courses created by the user
      try {
        const coursesResult = await axios.post("/api/courses", {
          createdBy: user.primaryEmailAddress.emailAddress,
        });

        if (coursesResult.data && Array.isArray(coursesResult.data.result)) {
          const courseCount = coursesResult.data.result.length;
          setTotalCourses(courseCount);

          // ✅ FIX: Only update state, do NOT recalculate credits
          setRemainingCredits(userResult[0].credits || 10);
        }
      } catch (courseError) {
        console.error("Error fetching courses:", courseError);
        setRemainingCredits(userResult[0].credits || 10);
      }
    } catch (error) {
      console.error("Error fetching user courses and credits:", error);
    }
  };

  const CheckIsNewUser = async () => {
    try {
      if (!user || !user.primaryEmailAddress?.emailAddress) {
        console.log("User data not fully loaded yet");
        return;
      }

      // Prepare user data with fallbacks for required fields
      const userData = {
        name:
          user.fullName || user.firstName + " " + user.lastName || "New User",
        email: user.primaryEmailAddress.emailAddress,
        imageUrl:
          user.imageUrl ||
          "https://ui-avatars.com/api/?name=" +
            encodeURIComponent(user.fullName || "User"),
        credits: 10, // Initial credits
      };

      // Validate required fields
      if (!userData.name || !userData.email || !userData.imageUrl) {
        console.error("Missing required user data:", userData);
        return;
      }

      // Check if user exists
      const result = await db
        .select()
        .from(USER_TABLE)
        .where(eq(USER_TABLE.email, userData.email));

      if (result.length === 0) {
        try {
          // Insert new user with all required fields
          const userResp = await db
            .insert(USER_TABLE)
            .values(userData)
            .returning({
              id: USER_TABLE.id,
              credits: USER_TABLE.credits,
            });

          console.log("User added:", userResp);

          if (userResp && userResp.length > 0) {
            setRemainingCredits(userResp[0].credits || 10);
          }
        } catch (insertError) {
          console.error("Error inserting user:", insertError);
          return; // Exit if insert fails
        }
      } else {
        // User already exists, set remaining credits from DB
        setRemainingCredits(result[0].credits || 10);
      }

      // Mark user data as saved to trigger course fetch
      setIsUserDataSaved(true);

      // Call API endpoint (if needed)
      const resp = await axios.post("/api/create-user", {
        name: userData.name,
        email: userData.email,
        imageUrl: userData.imageUrl,
      });
      console.log("API Response:", resp.data);
    } catch (apiError) {
      console.error("Error calling create-user API:", apiError);
    }
  };

  return (
    <CourseCountContext.Provider
      value={{
        totalCourses,
        setTotalCourses,
        remainingCredits,
        setRemainingCredits,
        refreshCredits: fetchUserCoursesAndCredits,
      }}
    >
      <div>{children}</div>
    </CourseCountContext.Provider>
  );
}

export default Provider;
