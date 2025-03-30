import { Router } from "express";
import { getAllContacts, getContactForDMList, searchContact } from "../controllers/contactControllers.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js"

const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, searchContact)
contactRoutes.get("/get-contacts-for-dm", verifyToken, getContactForDMList)
contactRoutes.get("/get-all-contacts", verifyToken, getAllContacts)

export default contactRoutes;