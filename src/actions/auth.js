"use server";

import bcrypt from "bcrypt";
import { neon } from "@neondatabase/serverless";
import { verifySession } from "./userSession";
import { securityQuestions } from "@/utils/securityQuestions";

export async function logIn(prevState, formData) {
  try {
    const userId = formData.get("userId");
    const password = formData.get("password");

    const sql = neon(`${process.env.STORE_DATABASE_URL}`);
    const response =
      await sql`SELECT id, password, role, deactivated_date FROM users;`;

    const userData = response.filter((user) => user.id === userId)[0];

    if (!userData) {
      return {
        success: false,
        message: "User does not exist!",
      };
    }

    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return {
        success: false,
        message: "Incorrect credentials.",
      };
    }

    if (userData.deactivated_date !== null) {
      return {
        success: false,
        message: "User deactivated.",
      };
    }

    return {
      success: true,
      message: `Logging into ${userId} ${userData.role} account...`,
      data: userData,
    };
  } catch (err) {
    console.error("Error logging in:", err);

    return {
      success: false,
      message: "Error loggin in. Please check the developer console.",
    };
  }
}

export async function getSecurityQuestion() {
  try {
    const session = await verifySession();

    const sql = neon(`${process.env.STORE_DATABASE_URL}`);
    const response =
      await sql`SELECT id, security_id FROM users WHERE id=${session.userId};`;

    if (response.security_id) {
      return {
        success: true,
        data: securityQuestions.filter((q) => q.id === response.security_id),
      };
    } else {
      return {
        success: false,
        message: "You have not set up a valid security question.",
      };
    }
  } catch (error) {
    console.error("Error logging in:", err);

    return {
      success: false,
      message: "Error loggin in. Please check the developer console.",
    };
  }
}

export async function setSecurityQuestionAns(
  additionalData,
  prevState,
  formData
) {
  try {
    const session = await verifySession();

    const { securityQuestionId } = additionalData;
    const securityAns = formData.get("securityAns");

    const sql = neon(`${process.env.STORE_DATABASE_URL}`);
    const response =
      await sql`UPDATE users SET security_id = ${securityQuestionId}, security_ans = ${securityAns} WHERE id = ${session.userId}`;
  } catch (error) {
    console.error("Error logging in:", err);

    return {
      success: false,
      message: "Error loggin in. Please check the developer console.",
    };
  }
}

export async function compareSecurityAns(prevState, formData) {
  try {
    const session = await verifySession();

    const securityAns = formData.get("securityAns");

    const sql = neon(`${process.env.STORE_DATABASE_URL}`);
    const response =
      await sql`SELECT id, security_id, security_ans FROM users WHERE id=${session.userId};`;

    if (response.security_id) {
      const isMatch = await bcrypt.compare(securityAns, response.security_ans);

      if (isMatch) {
        return {
          success: true,
          message: `You can now reset your password`,
        };
      } else {
        return {
          success: false,
          message: "Wrong answer.",
        };
      }
    } else {
      return {
        success: false,
        message: "You have not set up a valid security question.",
      };
    }
  } catch (error) {
    console.error("Error logging in:", err);

    return {
      success: false,
      message: "Error loggin in. Please check the developer console.",
    };
  }
}
