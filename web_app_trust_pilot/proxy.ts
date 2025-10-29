import { NextRequest } from "next/server";
import { updateSession } from "./authlib";

export async function proxy(request: NextRequest) {
    return await updateSession(request);
}