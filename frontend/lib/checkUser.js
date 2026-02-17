import { auth, currentUser } from "@clerk/nextjs/server";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
// const STRAPI_URL = "http://127.0.0.1:1337";

const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export const checkUser = async () => {
  const user = await currentUser();
  if (!user) {
    console.log("No user found");
    return null;
  }

  //connect to strapi database
  if (!STRAPI_API_TOKEN) {
    console.log("STRAPI_API_TOKEN is missing in .env.local");
    return null;
  }

  //what subscription the user is currently on
  const { has } = await auth(); //pricing logic
  const subscriptionTier = has({ plan: "pro" }) ? "pro" : "free";

  //call to db
  try {
    //Check if user exist in strapi
    const existingUserResponse = await fetch(
      `${STRAPI_URL}/api/users?filters[clerkId][$eq]=${user.id}`,
      {
        headers: {
          "Content-Type":"application/json",
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      },
    );
    if (!existingUserResponse.ok) {
      const errorText = await existingUserResponse.text();
      console.log("Strapi error response:", errorText);
      return null;
    }

    

    const existingUserData = await existingUserResponse.json();
    if (existingUserData.length > 0) {
      const existingUser = existingUserData[0];

      if (existingUser.subscriptionTier !== subscriptionTier) {
        await fetch(`${STRAPI_URL}/api/users/${existingUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
          body: JSON.stringify({ subscriptionTier }),
        });
      }
      return { ...existingUser, subscriptionTier };
    }

    //create a new user strapi

    //Get authenicated role

    const rolesResponse = await fetch(
      `${STRAPI_URL}/api/users-permissions/roles`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
      },
    );
    const rolesData = await rolesResponse.json();
    const authenicatedRole = rolesData.roles.find(
      (role) => role.type === "authenticated",
    );

    if (!authenicatedRole) {
      console.error("Authenticated role not found");
      return null;
    }

    const userData = {
      username:
        user.username || user.emailAddresses[0].emailAddress.split("@")[0],
      email: user.emailAddresses[0].emailAddress,
      password: `clerk_managed_${user.id}_${Date.now()}`,
      confirmed: true,
      blocked: false,
      clerkId: user.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      imageUrl: user.imageUrl || "",
      subscriptionTier,
      role: authenicatedRole.id,
    };

    const newUserResponse = await fetch(`${STRAPI_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(userData),
    });

    if (!newUserResponse.ok) {
      const errorText = await newUserResponse.text();
      console.error("Error creating user:", errorText);
      return null;
    }

    const newUser = await newUserResponse.json();
    return newUser;
  } catch (error) {
    console.error("error in checked user", error);
    return null;
  }
};
