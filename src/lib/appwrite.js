import { Client, Account, Databases, Avatars } from "appwrite";

export const client = new Client();

client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("66f17bf2003d23b70795");

export const account = new Account(client);
export const databases = new Databases(client);
export const endpoint = "https://9000-idx-lds-1731618450505.cluster-lqnxvk7thvfw4wbonsercicksm.cloudworkstations.dev";
export { ID, Query, Permission, Role } from "appwrite";