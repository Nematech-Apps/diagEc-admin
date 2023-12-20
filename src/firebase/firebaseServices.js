import {
    db, storage, Ref, UploadBytes, UploadBytesResumable, GetDownloadURL, DeleteObject, Collection, AddDoc, Doc, SetDoc, GetDoc, GetDocs, OnSnapshot, UpdateDoc, DeleteDoc, DeleteField, Query, Where, auth, signin, signupUser, signout
    , SendPasswordResetEmail, FetchSignInMethodsForEmail
}
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

export const resetPassword = (email) => {
    return SendPasswordResetEmail(auth, email);
}

export const checkIfUserWithEmailProvidedExist = (email) => {
    return FetchSignInMethodsForEmail(auth, email);
}

export const addUserToCollection = async (docId, data) => {
    const collectionRef = Doc(db, 'users', docId)

    const docData = {
        id: docId,
        email: data.email,
        identifiant: data.identifiant,
        role: data.role
    };


    try {
        await SetDoc(collectionRef, docData);
    } catch (error) {
        console.error('Error adding document: ', error);
    }
}


export const updateUserCollection = async (lastDate, docId) => {
    const collectionRef = Doc(db, 'users', docId);
    const snapshot = await GetDoc(collectionRef);

    const docData = {
        ...snapshot.data(),
        lastDateAuthentication: lastDate
    };

    return UpdateDoc(collectionRef, docData)
}

export const updateUserTimePassedCollection = async (tempsPasse, docId) => {
    const collectionRef = Doc(db, 'users', docId);
    const snapshot = await GetDoc(collectionRef);

    const docData = {
        ...snapshot.data(),
        tempsPasse: tempsPasse
    };

    return UpdateDoc(collectionRef, docData)
}


export const addUserHistoriqueToCollection = async (data, docId) => {
    const collectionRef = Doc(db, 'users', docId);
    const snapshot = await GetDoc(collectionRef);

    const docData = {
        ...snapshot.data(),
        historique: {

        }
    };

    return UpdateDoc(collectionRef, docData)
}



export const getUserByUid = (uid) => {
    const collectionRef = Doc(db, 'users', uid)

    return GetDoc(collectionRef);

}

export const getUserList = () => {
    const collectionRef = Collection(db, 'users');

    return collectionRef;
}

export const deleteUser = async (docId) => {
    const collectionRef = Doc(db, 'users', docId);

    return DeleteDoc(collectionRef);
}

//SECTEURS
export const addSecteur = (data) => {
    const collectionRef = Collection(db, 'secteurs');

    const docData = {
        libelleFr: data.libelleFr,
        libelleEn: data.libelleEn,
        libelleIt: data.libelleIt
    }

    return AddDoc(collectionRef, docData);
}

export const updateSecteur = async (data, docId) => {
    const collectionRef = Doc(db, 'secteurs', docId);
    const snapshot = await GetDoc(collectionRef);

    const docData = {
        ...snapshot.data(),
        libelleFr: data.libelleFr,
        libelleEn: data.libelleEn,
        libelleIt: data.libelleIt
    };

    return UpdateDoc(collectionRef, docData)
}

export const checkCategoriesInSecteur = async (secteurId) => {
    const collectionRef = Collection(db, 'categories');
    const q = Query(collectionRef, Where('secteurAppartenance.id', '==', secteurId));
    const querySnapshot = await GetDocs(q);
    return !querySnapshot.empty;

    // try {
    //     const querySnapshot = await GetDocs(q);
    //     const categories = [];

    //     querySnapshot.forEach((doc) => {
    //         categories.push({ id: doc.id, ...doc.data() });
    //     });

    //     return categories;
    // } catch (error) {
    //     console.error('Error checking categories in sector:', error);
    //     throw error;
    // }
}

export const checkCompaniesInSecteur = async (secteurId) => {
    const collectionRef = Collection(db, 'companies');
    const q = Query(collectionRef, Where('secteurAppartenance.id', '==', secteurId));
    const querySnapshot = await GetDocs(q);
    return !querySnapshot.empty;

    // try {
    //     const querySnapshot = await GetDocs(q);
    //     const categories = [];

    //     querySnapshot.forEach((doc) => {
    //         categories.push({ id: doc.id, ...doc.data() });
    //     });

    //     return categories;
    // } catch (error) {
    //     console.error('Error checking categories in sector:', error);
    //     throw error;
    // }
}

export const deleteSecteur = async (docId) => {
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
        libelleFr: data.libelleFr,
        libelleEn: data.libelleEn,
        libelleIt: data.libelleIt
    }

    return AddDoc(collectionRef, docData);
}

export const updateNiveau = async (data, docId) => {
    const collectionRef = Doc(db, 'niveaux', docId);
    const snapshot = await GetDoc(collectionRef);

    const docData = {
        ...snapshot.data(),
        libelleFr: data.libelleFr,
        libelleEn: data.libelleEn,
        libelleIt: data.libelleIt
    };

    return UpdateDoc(collectionRef, docData)
}


export const checkCategoriesInNiveau = async (niveauId) => {
    const collectionRef = Collection(db, 'niveaux');
    const q = Query(collectionRef, Where('niveauAppartenance.id', '==', niveauId));
    const querySnapshot = await GetDocs(q);
    return !querySnapshot.empty;
}

export const checkCompaniesInNiveau = async (niveauId) => {
    const collectionRef = Collection(db, 'companies');
    const q = Query(collectionRef, Where('niveauAppartenance.id', '==', niveauId));
    const querySnapshot = await GetDocs(q);
    return !querySnapshot.empty;
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

export const checkQuestionsInCategorie = async (categorieId) => {
    const collectionRef = Collection(db, 'questions');
    const q = Query(collectionRef, Where('categorie.id', '==', categorieId));
    const querySnapshot = await GetDocs(q);
    return !querySnapshot.empty;
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
        libelleFr: data.libelleFr,
        libelleEn: data.libelleEn,
        libelleIt: data.libelleIt,
        point: data.point
    }

    return AddDoc(collectionRef, docData);
}

export const updateAnswer = async (data, docId) => {
    const collectionRef = Doc(db, 'answers', docId);
    const snapshot = await GetDoc(collectionRef);

    const docData = {
        ...snapshot.data(),
        libelleFr: data.libelleFr,
        libelleEn: data.libelleEn,
        libelleIt: data.libelleIt,
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
        libelleFr: data.libelleFr,
        libelleEn: data.libelleEn,
        libelleIt: data.libelleIt,
        answers: data.answers,
        categories: data.categories,
        //categorie: JSON.parse(data.categorie),
        poids: data.poids,
        pilier: JSON.parse(data.pilier),
        // defi: JSON.parse(data.defi)
        defis: data.defis
    }

    return AddDoc(collectionRef, docData);
}

export const updateQuestion = async (data, docId) => {
    const collectionRef = Doc(db, 'questions', docId);
    const snapshot = await GetDoc(collectionRef);

    const docData = {
        ...snapshot.data(),
        libelleFr: data.libelleFr,
        answers: data.answers,
        categories: data.categories,
        //categorie: JSON.parse(data.categorie),
        poids: data.poids,
        pilier: JSON.parse(data.pilier),
        // defi: JSON.parse(data.defi)
        defis: data.defis
    };

    return UpdateDoc(collectionRef, docData)
}

export const updateQuestionEn = async (data, docId) => {
    const collectionRef = Doc(db, 'questions', docId);
    const snapshot = await GetDoc(collectionRef);

    const docData = {
        ...snapshot.data(),
        libelleEn: data.libelleEn,
        answers: data.answers,
        categories: data.categories,
        //categorie: JSON.parse(data.categorie),
        poids: data.poids,
        pilier: JSON.parse(data.pilier),
        // defi: JSON.parse(data.defi)
        defis: data.defis
    };

    return UpdateDoc(collectionRef, docData)
}


export const updateQuestionIt = async (data, docId) => {
    const collectionRef = Doc(db, 'questions', docId);
    const snapshot = await GetDoc(collectionRef);

    const docData = {
        ...snapshot.data(),
        libelleIt: data.libelleIt,
        answers: data.answers,
        categories: data.categories,
        //categorie: JSON.parse(data.categorie),
        poids: data.poids,
        pilier: JSON.parse(data.pilier),
        // defi: JSON.parse(data.defi)
        defis: data.defis
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
        libelleFr: data.libelleFr,
        libelleEn: data.libelleEn,
        libelleIt: data.libelleIt,
        definitionFr: data.definitionFr,
        definitionEn: data.definitionEn,
        definitionIt: data.definitionIt,
        ordre: data.ordre
    }

    return AddDoc(collectionRef, docData);
}

export const updatePilier = async (data, docId) => {
    const collectionRef = Doc(db, 'piliers', docId);
    const snapshot = await GetDoc(collectionRef);

    const docData = {
        ...snapshot.data(),
        libelleFr: data.libelleFr,
        definitionFr: data.definitionFr
    };

    return UpdateDoc(collectionRef, docData)
}



export const updatePilierEn = async (data, docId) => {
    const collectionRef = Doc(db, 'piliers', docId);
    const snapshot = await GetDoc(collectionRef);

    const docData = {
        ...snapshot.data(),
        libelleEn: data.libelleEn,
        definitionEn: data.definitionEn
    };

    return UpdateDoc(collectionRef, docData)
}


export const updatePilierIt = async (data, docId) => {
    const collectionRef = Doc(db, 'piliers', docId);
    const snapshot = await GetDoc(collectionRef);

    const docData = {
        ...snapshot.data(),
        libelleIt: data.libelleIt,
        definitionIt: data.definitionIt
    };

    return UpdateDoc(collectionRef, docData)
}

export const addMotCleToPilier = async (data, docId) => {
    const collectionRef = Doc(db, 'piliers', docId);

    const docData = {
        motClesFr: data.motClesFr
    };

    return UpdateDoc(collectionRef, docData)
}

export const deleteMotCle = (docId) => {
    const collectionRef = Doc(db, 'piliers', docId);


    const docData = {
        motClesFr: DeleteField()
    };

    return UpdateDoc(collectionRef, docData)
}


export const addMotCleToPilierEn = async (data, docId) => {
    const collectionRef = Doc(db, 'piliers', docId);

    const docData = {
        motClesEn: data.motClesEn
    };

    return UpdateDoc(collectionRef, docData)
}


export const deleteMotCleEn = (docId) => {
    const collectionRef = Doc(db, 'piliers', docId);


    const docData = {
        motClesEn: DeleteField()
    };

    return UpdateDoc(collectionRef, docData)
}


export const addMotCleToPilierIt = async (data, docId) => {
    const collectionRef = Doc(db, 'piliers', docId);

    const docData = {
        motClesIt: data.motClesIt
    };

    return UpdateDoc(collectionRef, docData)
}

export const deleteMotCleIt = (docId) => {
    const collectionRef = Doc(db, 'piliers', docId);


    const docData = {
        motClesIt: DeleteField()
    };

    return UpdateDoc(collectionRef, docData)
}


export const checkQuestionsInPilier = async (pilierId) => {
    const collectionRef = Collection(db, 'questions');
    const q = Query(collectionRef, Where('pilier.id', '==', pilierId));
    const querySnapshot = await GetDocs(q);
    return !querySnapshot.empty;
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
        pilier: JSON.parse(data.pilier),
        libelleFr: data.libelleFr,
        libelleEn: data.libelleEn,
        libelleIt: data.libelleIt
    }

    return AddDoc(collectionRef, docData);
}

export const updateDefis = async (data, docId) => {
    const collectionRef = Doc(db, 'defis', docId);
    const snapshot = await GetDoc(collectionRef);

    const docData = {
        ...snapshot.data(),
        pilier: JSON.parse(data.pilier),
        libelleFr: data.libelleFr
    };

    return UpdateDoc(collectionRef, docData)
}


export const updateDefisEn = async (data, docId) => {
    const collectionRef = Doc(db, 'defis', docId);
    const snapshot = await GetDoc(collectionRef);

    const docData = {
        ...snapshot.data(),
        pilier: JSON.parse(data.pilier),
        libelleEn: data.libelleEn
    };

    return UpdateDoc(collectionRef, docData)
}

export const updateDefisIt = async (data, docId) => {
    const collectionRef = Doc(db, 'defis', docId);
    const snapshot = await GetDoc(collectionRef);

    const docData = {
        ...snapshot.data(),
        pilier: JSON.parse(data.pilier),
        libelleIt: data.libelleIt
    };

    return UpdateDoc(collectionRef, docData)
}

export const uploadFicheReflexe = async (fiche, docId, lang) => {
    const storageRef = Ref(storage, `fiches_reflexes/defi/${docId}/${lang}`);
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


export const checkQuestionsInDefi = async (defiId) => {
    const collectionRef = Collection(db, 'questions');
    const q = Query(collectionRef, Where('defi.id', '==', defiId));
    const querySnapshot = await GetDocs(q);
    return !querySnapshot.empty;
}


export const deleteDefis = (docId) => {
    const collectionRef = Doc(db, 'defis', docId);
    return DeleteDoc(collectionRef);
}

export const deleteFicheReflexeInStorage = async (docId, lang) => {
    const storageRef = Ref(storage, `fiches_reflexes/defi/${docId}/${lang}`);
    return DeleteObject(storageRef);
}

export const getDefisList = () => {
    const collectionRef = Collection(db, 'defis');

    return collectionRef;
}

export const getDefisListInPilier = async (pilier) => {
    const collectionRef = Collection(db, 'defis');
    const q = Query(collectionRef, Where('pilier.id', '==', pilier.id));
    const querySnapshot = await GetDocs(q);
    return querySnapshot;
}

//Companies
export const getCompanyList = () => {
    const collectionRef = Collection(db, 'companies');

    return collectionRef;
}


// export const getCompanyListByNiveau = async () => {
//     const collectionRef = Collection(db, 'companies');

//     try {
//         const querySnapshot = await GetDocs(collectionRef);

//         const groupedData = {};
//         querySnapshot.forEach((doc) => {
//             const data = doc.data();
//             const groupField = data.niveauAppartenance.libelle;
//             if (!groupedData[groupField]) {
//                 groupedData[groupField] = [data];
//             } else {
//                 groupedData[groupField].push(data);
//             }
//         });


//         return groupedData;
//     } catch (error) {
//         console.error('Error getting company list:', error);
//         return null;
//     }
// }


export const getCompanyListByNiveau = async () => {
    const collectionRef = Collection(db, 'companies');

    try {
        const querySnapshot = await GetDocs(collectionRef);

        const groupedData = {};
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const groupField = data.niveauAppartenance?.libelle; // Utilisation de l'opérateur de nullish coalescing (??)
            
            // Vérification pour éviter les groupField indéfinis
            if (groupField !== undefined) {
                if (!groupedData[groupField]) {
                    groupedData[groupField] = [data];
                } else {
                    groupedData[groupField].push(data);
                }
            }
        });

        return groupedData;
    } catch (error) {
        console.error('Error getting company list:', error);
        return null;
    }
}



export const getCompanyListBySecteur = async () => {
    const collectionRef = Collection(db, 'companies');

    try {
        const querySnapshot = await GetDocs(collectionRef);

        const groupedData = {};
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const groupField = data.secteurAppartenance?.libelle; // Utilisation de l'opérateur de nullish coalescing (??)

            // Vérification pour éviter les groupField indéfinis
            if (groupField !== undefined) {
                if (!groupedData[groupField]) {
                    groupedData[groupField] = [data];
                } else {
                    groupedData[groupField].push(data);
                }
            }
        });

        return groupedData;
    } catch (error) {
        console.error('Error getting company list:', error);
        return null;
    }
}


//settings

export const updateSettings = async (data) => {
    const collectionRef = Collection(db, 'settings');
    const snapshot = await GetDocs(collectionRef);

    let newData = null;

    snapshot.forEach((doc) => {
        newData = doc.data();
    });

    if (newData) {
        if(data.maintenanceMode != undefined){
            newData.maintenanceMode = data.maintenanceMode;
        }
        if(data.maintenanceMode2 != undefined){
            newData.maintenanceMode2 = data.maintenanceMode2;
        }
        // Mettez à jour le document dans la collection 'settings'
        return UpdateDoc(Doc(collectionRef, newData.id), newData);
    } else {
        console.error('Aucun document trouvé dans la collection "settings"');
    }
};


export const getSettingsList = () => {
    const collectionRef = Collection(db, 'settings');

    return collectionRef;
}

//deviceTokens

export const getDeviceTokensList = () => {
    const collectionRef = Collection(db, 'deviceTokens');

    return collectionRef;
}

//audits - ouvertures

export const getAuditsOuverturesForCompany = async (userUid) => {
    try {
        const ouverturesCollectionRef = Collection(db, 'ouvertures');

        const q = Query(ouverturesCollectionRef, Where('uid', '==', userUid));
        const querySnapshot = await GetDocs(q);

        console.log(`querySnapshot.size : ${querySnapshot.size}`)

        const ouverturesList = [];
        querySnapshot.forEach((doc) => {
            ouverturesList.push(doc.data());
        });

        return ouverturesList;
    } catch (error) {
        console.error('Erreur lors de la récupération des ouvertures :', error);
        throw error;
    }
};


// fiches consultés


export const getFichesByUid = (uid) => {
    const collectionRef = Doc(db, 'defis', uid)

    return GetDoc(collectionRef);

}


export const getQuestionsByUid = (uid) => {
    const collectionRef = Doc(db, 'questions', uid)

    return GetDoc(collectionRef);

}

export const getPiliersByUid = (uid) => {
    const collectionRef = Doc(db, 'piliers', uid)

    return GetDoc(collectionRef);

}


export const getAnswersByUid = (uid) => {
    const collectionRef = Doc(db, 'answers', uid)

    return GetDoc(collectionRef);

}

export const getFichesConsultesForCompany = async (userUid) => {
    try {
        const fichesCollectionRef = Collection(db, 'fiches');

        const q = Query(fichesCollectionRef, Where('uid', '==', userUid));
        const querySnapshot = await GetDocs(q);

        console.log(`querySnapshot.size : ${querySnapshot.size}`)

        const fichesList = [];
        querySnapshot.forEach((doc) => {
            fichesList.push(doc.data());
        });

        return fichesList;
    } catch (error) {
        console.error('Erreur lors de la récupération des fiches :', error);
        throw error;
    }
};





export const getDefisRealisesForCompany = async (userUid) => {
    try {
        const defisRealisesCollectionRef = Collection(db, 'defisFaits');

        const q = Query(defisRealisesCollectionRef, Where('uid', '==', userUid));
        const querySnapshot = await GetDocs(q);

        console.log(`querySnapshot.size : ${querySnapshot.size}`)

        const defisList = [];
        querySnapshot.forEach((doc) => {
            defisList.push(doc.data());
        });

        return defisList;
    } catch (error) {
        console.error('Erreur lors de la récupération des défis :', error);
        throw error;
    }
};


export const getAuditsConnexionsForCompany = async (userUid) => {
    try {
        const connexionsCollectionRef = Collection(db, 'connexions');

        const q = Query(connexionsCollectionRef, Where('uid', '==', userUid));
        const querySnapshot = await GetDocs(q);

        console.log(`querySnapshot.size : ${querySnapshot.size}`)

        const connexionsList = [];
        querySnapshot.forEach((doc) => {
            connexionsList.push(doc.data());
        });

        return connexionsList;
    } catch (error) {
        console.error('Erreur lors de la récupération des ouvertures :', error);
        throw error;
    }
};



export const getAuditsQuestionsForCompany = async (userUid) => {
    try {
        const reponsesQuestionnairesCollectionRef = Collection(db, 'reponsesQuestionnaires');

        const q = Query(reponsesQuestionnairesCollectionRef, Where('uid', '==', userUid));
        const querySnapshot = await GetDocs(q);

        console.log(`querySnapshot.size : ${querySnapshot.size}`)

        const reponsesQuestionnairesList = [];
        querySnapshot.forEach((doc) => {
            reponsesQuestionnairesList.push(doc.data());
        });

        return reponsesQuestionnairesList;
    } catch (error) {
        console.error('Erreur lors de la récupération des ouvertures :', error);
        throw error;
    }
};

function timeStampToDateString(timestamp) {
    // Convert the timestamp (in seconds) to milliseconds since JavaScript Date works with milliseconds.
    const timestampInMilliseconds = timestamp * 1000;

    // Create a new Date object using the timestamp in milliseconds.
    const date = new Date(timestampInMilliseconds);

    // Get the components of the date (year, month, day, hours, minutes, seconds).
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so we add 1 and pad with '0'.
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Create the formatted date string in the desired format.
    const dateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return dateString;
}

function getMonthFromDate(dateString) {
    // Extract the day and month parts from the date string.
    const [day, monthName, yearTime] = dateString.split(' ');

    // Return the month name.
    return monthName;
}

export const getCompanyListByMonth = async () => {
    const collectionRef = Collection(db, 'companies');

    try {
        const querySnapshot = await GetDocs(collectionRef);

        const groupedData = {};
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // console.log(`createdAt: ${data.createdAt}`);

            // Convert the timestamp (in seconds) to a JavaScript Date object.
            const date = new Date(data.createdAt.seconds * 1000);

            // Get the month name from the Date object.
            const monthName = date.toLocaleString('default', { month: 'long' });
            console.log(`monthName : ${monthName}`);

            // Use the month name as the key for grouping the data.
            const groupField = monthName.substring(0, 3);

            if (!groupedData[groupField]) {
                groupedData[groupField] = [data];
            } else {
                groupedData[groupField].push(data);
            }
        });

        return groupedData;
    } catch (error) {
        console.error('Error getting company list:', error);
        return null;
    }
}

