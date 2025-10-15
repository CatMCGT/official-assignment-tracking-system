"use server";

import { verifySession } from "@/actions/userSession";
import { getUser } from "../users/getUser";

export async function createSubject(additionalData, prevState, formData) {
  try {
    const session = await verifySession();
    if (!session) throw new Error("Session not found.");

    const user = await getUser();
    const userRole = user.role;

    if (userRole !== "admin")
      throw new Error("User not authorised to create subject.");

    const {
      subjectType,
      subjectShorthand,
      subjectTeacherId,
      subjectStudentIds,
    } = additionalData;

    let subjectId = "";
    if (subjectType === "grade") {
      const grade = formData.get("grade");
      const block = formData.get("block");

      subjectId = `g${grade}-${subjectShorthand}-${block}`;
    } else if (subjectType === "class") {
      const subjectClass = formData.get("class");

      subjectId = `${subjectClass.toLowerCase()}-${subjectShorthand}`;
    }

    console.log(subjectId, subjectTeacherId, subjectStudentIds);
  } catch (err) {
    console.error("Error creating subject:", err);

    return {
      success: false,
      message: `Failed to create user. Please check the developer console.`,
    };
  }
}
