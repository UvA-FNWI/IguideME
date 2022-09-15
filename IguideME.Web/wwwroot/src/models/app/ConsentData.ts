import React from "react"

export interface ConsentData {
    course_id: number;
    user_id: number;
    login_id: string;
    name: string;
    granted: number;
}