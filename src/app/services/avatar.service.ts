import { Auth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Storage, getDownloadURL, ref, uploadString } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage,
  ) { }

  getUserProfile() {
    const user = this.auth.currentUser;
    const userDocRef = doc(this.firestore, `users/${user!.uid}`);
    return docData(userDocRef);
  }

  async uploadImage(cameraFile: Photo) {
    const user = this.auth.currentUser;
    const path = `uploads/${user!.uid}/profile.png`;
    const storageRef = ref(this.storage, path);
    try {
      if (cameraFile.base64String) {
        await uploadString(storageRef, cameraFile.base64String, 'base64');
        const imageUrl = await getDownloadURL(storageRef);
        const userDocRef = doc(this.firestore, `users/${user!.uid}`);
        await setDoc(userDocRef, {
          imageUrl,
        });
      }
      return true;
    } catch (e) {
      return null;
    }
  }
}
