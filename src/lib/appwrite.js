import { Client, Account, Databases, Functions, Avatars } from "appwrite";

export const client = new Client();

client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("66f17bf2003d23b70795");

export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);
export const endpoint = "https://9000-idx-lds-1737864063978.cluster-aj77uug3sjd4iut4ev6a4jbtf2.cloudworkstations.dev";
export { ID, Query, Permission, Role } from "appwrite";