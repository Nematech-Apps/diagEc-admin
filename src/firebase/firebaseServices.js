import { db, storage, Ref, UploadBytes, UploadBytesResumable, GetDownloadURL, DeleteObject, Collection, AddDoc, Doc, SetDoc, GetDoc, GetDocs, OnSnapshot, UpdateDoc, DeleteDoc, auth, signin, signupUser, signout }
    from './firebaseConfig';

export const authenticate = (email, password) => {
    return signin(auth, email, password);
}


export const register = (email, password) => {
    return signupUser(auth, email, password);
}

export const logout = () => {
    signout(auth);
}


export const addUserToCollection = async (docId, data) => {
    const collectionRef = Doc(db, 'users', docId)

    const docData = {
        id: docId,
        email: data.email,
        identifiant: data.identifiant
    };


    try {
        await SetDoc(collectionRef, docData);
    } catch (error) {
        console.error('Error adding document: ', error);
    }
}


export const getUserByUid = (uid) => {
    const collectionRef = Doc(db, 'users', uid)

    return GetDoc(collectionRef);

}

export const getUserList = () => {
    const collectionRef = Collection(db, 'users');

    return GetDocs(collectionRef);
}

//SECTEURS
export const addSecteur = (data) => {
    const collectionRef = Collection(db, 'secteurs');

    const docData = {
        libelle: data.libelle
    }

    return AddDoc(collectionRef, docData);
}

export const updateSecteur = async (data, docId) => {
    const collectionRef = Doc(db, 'secteurs', docId);
    const snapshot = await GetDoc(collectionRef);

    const docData = {
        ...snapshot.data(),
        libelle: data.libelle
    };

    return UpdateDoc(collectionRef, docData)
}

export const deleteSecteur = (docId) => {
    const collectionRef = Doc(db, 'secteurs', docId);
    return DeleteDoc(collectionRef);
}

export const getSecteurList = () => {
    const collectionRef = Collection(db, 'secteurs');

    return collectionRef;
}



//NIVEAUX
export const addNiveau = async (data) => {
    const collectionRef = Collection(db, 'niveaux');

    const docData = {
        libelle: data.libelle
    }

    return AddDoc(collectionRef, docData);
}

export const updateNiveau = async (data, docId) => {
    const collectionRef = Doc(db, 'niveaux', docId);
    const snapshot = await GetDoc(collectionRef);

    const docData = {
        ...snapshot.data(),
        libelle: data.libelle
    };

    return UpdateDoc(collectionRef, docData)
}

export const deleteNiveau = (docId) => {
    const collectionRef = Doc(db, 'niveaux', docId);
    return DeleteDoc(collectionRef);
}

export const getNiveauList = () => {
    const collectionRef = Collection(db, 'niveaux');

    return collectionRef;
}

//CATEGORIES
export const addCategorie = async (data) => {
    const collectionRef = Collection(db, 'categories');

    const docData = {
        secteurAppartenance: JSON.parse(data.secteurAppartenance),
        niveauAppartenance: JSON.parse(data.niveauAppartenance),
        libelle: data.libelle
    }

    return AddDoc(collectionRef, docData);
}

export const updateCategorie = async (data, docId) => {
    const collectionRef = Doc(db, 'categories', docId);
    const snapshot = await GetDoc(collectionRef);

    const docData = {
        ...snapshot.data(),
        secteurAppartenance: JSON.parse(data.secteurAppartenance),
        niveauAppartenance: JSON.parse(data.niveauAppartenance),
        libelle: data.libelle
    };

    return UpdateDoc(collectionRef, docData)
}

export const deleteCategorie = (docId) => {
    const collectionRef = Doc(db, 'categories', docId);
    return DeleteDoc(collectionRef);
}

export const getCategoriesList = () => {
    const collectionRef = Collection(db, 'categories');

    return collectionRef;
}


//ANSWERS
export const addAnswer = async (data) => {
    const collectionRef = Collection(db, 'answers');

    const docData = {
        libelle: data.libelle,
        point: data.point
    }

    return AddDoc(collectionRef, docData);
}

export const updateAnswer = async (data, docId) => {
    const collectionRef = Doc(db, 'answers', docId);
    const snapshot = await GetDoc(collectionRef);

    const docData = {
        ...snapshot.data(),
        libelle: data.libelle,
        point: data.point
    };

    return UpdateDoc(collectionRef, docData)
}

export const deleteAnswer = (docId) => {
    const collectionRef = Doc(db, 'answers', docId);
    return DeleteDoc(collectionRef);
}

export const getAnswerList = () => {
    const collectionRef = Collection(db, 'answers');

    return collectionRef;
}


//QUESTIONS
export const addQuestion = async (data) => {
    const collectionRef = Collection(db, 'questions');

    const docData = {
        libelle: data.libelle,
        answers: data.answers,
        categorie: JSON.parse(data.categorie),
        poids: data.poids,
        pilier: JSON.parse(data.pilier),
        defi: JSON.parse(data.defi)
    }

    return AddDoc(collectionRef, docData);
}

export const updateQuestion = async (data, docId) => {
    const collectionRef = Doc(db, 'questions', docId);
    const snapshot = await GetDoc(collectionRef);

    const docData = {
        ...snapshot.data(),
        libelle: data.libelle,
        answers: data.answers,
        categorie: JSON.parse(data.categorie),
        poids: data.poids,
        pilier: JSON.parse(data.pilier),
        defi: JSON.parse(data.defi)
    };

    return UpdateDoc(collectionRef, docData)
}

export const deleteQuestion = (docId) => {
    const collectionRef = Doc(db, 'questions', docId);
    return DeleteDoc(collectionRef);
}

export const getQuestionList = () => {
    const collectionRef = Collection(db, 'questions');

    return collectionRef;
}


//PILIERS
export const addPilier = async (data) => {
    const collectionRef = Collection(db, 'piliers');

    const docData = {
        libelle: data.libelle,
        definition: data.definition
    }

    return AddDoc(collectionRef, docData);
}

export const updatePilier = async (data, docId) => {
    const collectionRef = Doc(db, 'piliers', docId);
    const snapshot = await GetDoc(collectionRef);

    const docData = {
        ...snapshot.data(),
        libelle: data.libelle,
        definition: data.definition
    };

    return UpdateDoc(collectionRef, docData)
}


export const addMotCleToPilier = async (data, docId) => {
    const collectionRef = Doc(db, 'piliers', docId);

    const docData = {
        motCles: data.motCles
    };

    return UpdateDoc(collectionRef, docData)
}

export const deletePilier = (docId) => {
    const collectionRef = Doc(db, 'piliers', docId);
    return DeleteDoc(collectionRef);
}

export const getPilierList = () => {
    const collectionRef = Collection(db, 'piliers');

    return collectionRef;
}

//DEFIS
export const addDefis = async (data) => {
    const collectionRef = Collection(db, 'defis');

    const docData = {
        libelle: data.libelle
    }

    return AddDoc(collectionRef, docData);
}

export const updateDefis = async (data, docId) => {
    const collectionRef = Doc(db, 'defis', docId);
    const snapshot = await GetDoc(collectionRef);

    const docData = {
        ...snapshot.data(),
        libelle: data.libelle
    };

    return UpdateDoc(collectionRef, docData)
}

export const uploadFicheReflexe = async (fiche, docId) => {
    const storageRef = Ref(storage, `fiches_reflexes/defi/${docId}`);
    const uploadTask = UploadBytesResumable(storageRef, fiche);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        reject(error);
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        reject(error);
                        break;
                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        reject(error);
                        break;
                }
            },
            async () => {
                try {
                    const downloadURL = await GetDownloadURL(uploadTask.snapshot.ref);
                    console.log(downloadURL);
                    resolve(downloadURL);
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
};

export const updateFicheReflexionCollection = async (url) => {
    const collectionRef = Collection(db, 'ficheReflexes');

    const docData = {
        ficheUrl: url
    }

    return AddDoc(collectionRef, docData);
}



export const deleteDefis = (docId) => {
    const collectionRef = Doc(db, 'defis', docId);
    return DeleteDoc(collectionRef);
}

export const deleteFicheReflexeInStorage = async (docId) => {
    const storageRef = Ref(storage, `fiches_reflexes/defi/${docId}`);
    return DeleteObject(storageRef);
}

export const getDefisList = () => {
    const collectionRef = Collection(db, 'defis');

    return collectionRef;
}

//Companies
export const getCompanyList = () => {
    const collectionRef = Collection(db, 'companies');

    return collectionRef;
}