#!/usr/bin/env node
import * as admin from "firebase-admin";
import { migrate } from "./utils/firebase";
require('dotenv').config();

const CREDENTIALS = process.env.CREDENTIALS;

admin.initializeApp({
  credential: admin.credential.cert(CREDENTIALS),
});

const db = admin.firestore();

migrate(db);
