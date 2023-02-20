import { ref, getDownloadURL, uploadBytes, getStorage } from "firebase/storage";
// import { deleteObject } from "firebase/storage";

export const uploadUserPhotoToServer = async (photoUri) => {
  const storage = getStorage();
  const response = await fetch(photoUri);
  const file = await response.blob();

  const filename = new Date().getTime() + "userPost.jpg";
  const storageRef = ref(storage, "userPhoto/" + filename);

  await uploadBytes(storageRef, file).then((snapshot) => {
    console.log("Uploaded a blob or file!");
  });

  return await getDownloadURL(storageRef).then((downloadURL) => {
    return downloadURL;
  });
};

// export const deleteUserPhotoFromStorage = async (userUid) => {
//   const storage = getStorage();

//   // Create a reference to the file to delete
//   const desertRef = ref(storage, "userPhoto/" + userUid);

//   // Delete the file
//   deleteObject(desertRef)
//     .then(() => {
//       console.log("photo deleted");
//     })
//     .catch((error) => {
//       console.log("photo deleted error", error);
//     });
// };
