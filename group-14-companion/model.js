import * as common from 'common';

/***********

Documentation

Sections
	Data
	sampleData

***********/

export class Data {


	/**
	 *
	 * STATIC PROPERTIES / METHODS
	 * 
	 */
	
	/**
	 * Standard strings for showing the state of a document.
	 * Use it as just a class constant, i.e. Data.IN
	 * (I wrote it as a getter method because JavaScript doesn't support static properties)
	 */
	static get IN() { return 'in' }
	static get YOU() { return 'you' }
	static get OTHER() { return 'other' }

	/**
	 * Standard strings for actions that happen to a document.
	 */
	static get CREATE() { return 'stored' }
	static get RETRIEVE() { return 'retrieved' }
	static get RETURN() { return 'returned' }
	static get DELETE() { return 'removed' }

	/**
	 * Generates a guaranteed unique "hash" ID as a string.
	 */
	static newID() {
		return 'ID' + Date.now() + '-' + Math.floor(Math.random() * 1000000);
	}


	/**
	 *
	 * CONSTRUCTOR
	 * 
	 */
	
	/**
	 * Initializes Data object with most tables empty and some tables with
	 * default entries. State is uninitialized.
	 */
	constructor() {

		/* Holds the current state of the application for screen logic */
		this.state = {
			document: '', // The id of the current document the user is viewing
			folder: '', // The id of the current folder the user is viewing
			user: '', // The id of the current user the user is viewing
			login: '', // The id of the user
			documentsSort: 'name', // current sort criteria ('name', 'dateCreated', 'dateLastAccessed', 'accessTierAsc', 'accessTierDesc', 'labels')
			documentsSearch: '', // current search string
		};

		/* Our data "tables" */
		this.documents = {
			//'dummyDoc': { // Temp. Remove when done
			//	name: 'dummy doc',	
			//	labels: [],				
			//	tier: 'admin',
			//	description: '',	
			//	folder: 'root',			
			//	locker: null,			
			//	history: ['e1'],		
			//}
		};
		this.folders = {
			'root': { // The root or highest folder in the folder hierarchy
				name: '',
				labels: [],
				parent: null,
				folders: [],
				documents: []
			},
			'search': {	// fake folder to hold the results of search
				name: 'Search Results',
				labels: [],
				parent: 'root',
				folders: [],
				documents: [],
			},
		};
		this.users = {
			'admin': { // Initial admin account. Can be different from the actual administrator account
				firstName: 'Admin',
				lastName: '',
				tier: 'admin',
				email: '',
			},
			'unknown': { // Default value for broken links to users
				firstName: 'Unknown',
				lastName: '',
				tier: 'default',
				email: '',
			}
		};
		this.tiers = {
			'admin': { // Admin tier. Should have access to everything
				name: 'Admin',
				color: 'black',
				rank: Number.POSITIVE_INFINITY
			},
			'default': { // Lowest tier
				name: 'Lowest Access',
				color: 'grey',
				rank: Number.NEGATIVE_INFINITY
			},
		};
		this.labels = {
			//'temp': { // Temp. Remove when done.
			//	name: 'temp',
			//	color: 'red',
			//	abbreviation: 'T',
			//}
		};
		this.events = {
			//'e1': {user: 'admin',	// Temp. Remove when done.
			//	document: 'dummyDoc',			
			//	action: 'created',			
			//	date: new Date(),
			//}
		};
		this.lockers = {};
		this.cabinets = {};
		this.emptyLockers = new Set();
	}


	/**
	 *
	 * GENERAL METHODS
	 * 
	 */
	
	/**
	 * Set the state of the application
	 * 
	 * @param {Object} data: new values
	 *
	 * Usage: data.setState({ folder: '3e6f5707' });
	 */
	setState(data) {
		Object.assign(this.state, data);
	}

	/**
	 * Returns all of the data in JSON format
	 */
	toString() {
		return JSON.stringify({
			state: this.state,
			documents: this.documents,
			folders: this.folders,
			users: this.users,
			tiers: this.tiers,
			labels: this.labels,
			events: this.events,
			lockers: this.lockers,
			cabinets: this.cabinets,
		});
	}

	/**
	 * Tests if all references in the object to other entries in other
	 * tables are valid and point to actual entries. Allows null values
	 * for compatibility with other methods.
	 * 
	 * @param  {Object} data: keys with standard names, values to test
	 * @return {boolean} true if all references are valid
	 *
	 * Usage: data.validateData({ folder: '3e6f5707', labels: ['8294fdef', '0e063425'] });
	 */
	validateData(data) {
		if ('documents' in data) {
			if (! data.documents.every(id => (id in this.documents))) return false;
		}
		if ('folder' in data) {
			if (! (data.folder in this.folders || data.folder === null)) return false; 
		}
		if ('folders' in data) {
			if (! data.folders.every(id => (id in this.folders))) return false;
		}
		if ('parent' in data) {
			if (! (data.parent in this.folders || data.parent === null)) return false;
		}
		if ('user' in data) {
			if (! (data.user in this.users || data.user === null)) return false;
		}
		if ('tier' in data) {
			if (! (data.tier in this.tiers || data.tier === null)) return false;
		}
		if ('labels' in data) {
			if (! data.labels.every(id => (id in this.labels))) return false;
		}
		if ('history' in data) {
			if (! data.history.every(id => (id in this.events))) return false;
		}
		if ('locker' in data) {
			if (! (data.locker in this.lockers || data.locker === null)) return false;
		}
		if ('cabinet' in data) {
			if (! (data.cabinet in this.cabinets || data.cabinet === null)) return false;
		}
		return true;
	}

	/**
	 * Corrects any values with broken points to other tables.
	 * Replaces them with default values, or for lists, removes the item from the list.
	 * 
	 * @param  {Object} data: keys with standard names, values to correct
	 */
	correctData(data) {
		if ('documents' in data) {
			data.documents = data.documents.filter(id => (id in this.documents));
		}
		if ('folder' in data) {
			data.folder = data.folder in this.folders ? data.folder : 'root';
		}
		if ('folders' in data) {
			data.folders = data.folders.filter(id => (id in this.folders));
		}
		if ('parent' in data) {
			data.parent = (data.parent in this.folders || data.parent === null) ? data.parent : 'root';
		}
		if ('user' in data) {
			data.user = (data.user in this.users || data.user === null) ? data.user : 'unknown';
		}
		if ('tier' in data) {
			data.tier = data.tier in this.tiers ? data.tier : 'default';
		}
		if ('labels' in data) {
			data.labels = data.labels.filter(id => (id in this.labels));
		}
		if ('history' in data) {
			data.history = data.history.filter(id => (id in this.events));
		}
		if ('locker' in data) {
			data.locker = (data.locker in this.lockers || data.locker === null) ? data.locker : null;
		}
		if ('cabinet' in data) {
			// TODO
		}
	}

	/**
	 * Add an entry to a table. Entry data must be valid. Generates entry id.
	 * 
	 * @param {Object} table: Data table to add entry to
	 * @param {Object} data: entry to add
	 * @return {String} id of added entry, or false if unsuccessful
	 */
	addEntry(table, data) {
		if (this.validateData(data)) {
			let id = Data.newID();
			table[id] = data;
			return id;
		} else {
			return null;
		}
	}

	/**
	 * Update an entry in a table. Entry id and data must be valid.
	 * 
	 * @param  {Object} table: ex. this.documents, this.labels
	 * @param  {String} id: id of entry in table
	 * @param  {Object} data: new values
	 * @return {boolean} true if successfully updated (new values are valid)
	 */
	updateEntry(table, id, data) {
		if (id in table && this.validateData(data)) {
			let entry = table[id];
			Object.assign(entry, data);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Gets a copy of an entry from a table. If the entry contains
	 * invalid links, these will be corrected in the original table
	 * before making the copy.
	 * 
	 * @param  {Object} table: ex. this.documents, this.labels
	 * @param  {String} id: id of entry in table
	 * @return {Object} copy of entry in table
	 */
	getCorrectedCopy(table, id) {
		if (id in table) {
			let entry = table[id];
			if (! this.validateData(entry)) {
				this.correctData(entry);
			}
			let copy = Object.assign({}, entry);
			return copy;
		} else {
			return null;
		}
	}


	/**
	 * 
	 * DOCUMENTS
	 * 
	 */

	/**
	 * Creates a new document. Also initializes its history with a 'create' event if history not passed in.
	 * @param {Object} data: document data, links must be valid, see code
	 * @return {String} id of document if successfully created, else null
	 */
	addDocument(data) {
		let document = { // default values
			name: 'New Item',		// {String}
			labels: [],				// {String[]} ids of labels
			tier: this.users[this.state.login].tier,	// {String} id of tier
			description: '',		// {String}
			folder: 'root',			// {String} id of containing folder
			locker: null,			// {String} id of locker. Should be null when document out.
			history: [],			// {String[]} ids of events. Sorted by date ascending.
		}
		Object.assign(document, data);
		let id = this.addEntry(this.documents, document);
		if (id === null) return null;

		if (! ('history' in data)) {
			let eventID = this.addEvent({ user: this.state.login, document: id, action: Data.CREATE });
			this.updateDocument(id, { history: [eventID] });
		}

		this.addDocumentToFolder(id, document.folder);
		return id;
	}

	/**
	 * Updates a document's data.
	 * 
	 * @param  {String} id: document id
	 * @param  {Object} data: new values. All links must be valid
	 * @return {boolean} true if successful update
	 */
	updateDocument(id, data) {
		return this.updateEntry(this.documents, id, data);
	}

	/**
	 * Returns a copy of a document's data. Corrects any broken links
	 * in the original data before copying. De-references links.
	 * 
	 * @param  {String} id: document id
	 * @return {Object} copy of document data. Operations on this copy
	 * 					will not affect the original data. Links to
	 * 					labels, tiers, history will be de-referenced into
	 * 					actual data. Additional useful values added: out,
	 * 					dateCreated.
	 * 
	 * Example returned data:
	 * 	{
	 * 		id: '3b2aa2c6',
	 * 		name: 'Document #1',
	 * 		labels: [
	 * 			{
	 * 				id: '3e6f5707',
	 * 				name: 'completed',
	 * 				color: 'green',
	 * 				abbreviation: 'C',
	 * 			},
	 * 			{
	 * 				id: '46efacaf',
	 * 				name: 'in progress',
	 * 				color: 'yellow',
	 * 				abbreviation: 'I',
	 * 			}
	 * 		],
	 * 		tier: {
	 * 			id: '936420de',
	 * 			name: 'Tier 1',
	 * 			color: 'red',
	 * 		},
	 * 		out: 'you',
	 * 		dateCreated: new Date('1995-12-17T03:24:00'),
	 * 		description: 'Testing 123',
	 * 		folder: '8294fdef',
	 * 		locker: '0e063425',
	 * 		history: [
	 * 			{
	 * 				id: '3b2aa2c6',
	 * 				user: {
	 * 					id: 'ae97a999',
	 * 					firstName: 'allison',
	 * 					lastName: 'rory',
	 * 					tier: {
	 * 						id: '936420de',
	 * 						name: 'Tier 1',
	 * 						color: 'red',
	 * 					},
	 * 					email: 'arory@gmail.com',
	 * 					abbreviation: 'AR',
	 * 					fullName: 'Allison Rory',
	 * 				},
	 * 				document: ... (see getDocumentAbbreviatedData),
	 * 				action: 'created',
	 * 				date: new Date('1995-12-17T03:24:00'),
	 * 			},
	 * 			{
	 * 				... (another one)
	 * 			},
	 * 		]
	 * 	}
	 * 
	 */
	getDocumentData(id) {
		let document = this.getCorrectedCopy(this.documents, id);
		if (document === null) return null;

		document.id = id;
		document.labels = this.getLabelListData(document.labels);
		document.tier = this.getTierData(document.tier);
		document.out = this.getDocumentState(id);
		document.history = this.getEventListData(document.history);
		document.dateCreated = document.history[0].date;
		document.path = this.getPath(document.folder);

		return document;
	}

	/**
	 * Returns an abbreviated copy of a document's data. See
	 * getDocumentData for full caveats.
	 * 
	 * @param  {String} id: document id
	 * @return {Object} abbreviated copy of document data
	 *
	 * Example returned data:
	 * 	{
	 * 		id: '3b2aa2c6',
	 * 		name: 'Document #1',
	 * 		labels: ['3e6f5707', '46efacaf'],
	 * 		tier: '936420de',
	 * 		description: 'Testing 123',
	 * 		folder: '8294fdef',
	 * 		locker: '0e063425',
	 * 		history: ['3b2aa2c6', '3e6f5707'],
	 * 	}
	 */
	getDocumentAbbreviatedData(id) {
		let document = this.getCorrectedCopy(this.documents, id);
		if (document === null) return null;

		document.id = id;

		return document;
	}

	/**
	 * Derefences a list of document ids to full document data
	 * 
	 * @param  {String[]} idList: array of ids of documents
	 * @return {Object[]} array of document data (see getDocumentData)
	 */
	getDocumentListData(idList) {
		let documentList = idList.map(id => this.getDocumentData(id)).filter(x => x);
		switch (this.state.documentsSort) {
			case 'accessTierAsc':
				documentList.sort(documentTierComparator);
				break;
			case 'accessTierDesc':
				documentList.sort(documentTierComparator).reverse();
				break;
			case 'labels':
				documentList.sort(documentLabelsComparator);
				break;
			case 'dateCreated':
				documentList.sort(documentDateCreatedComparator);
				break;
			case 'dateLastAccessed':
				documentList.sort(documentDateLastAccessedComparator);
				break;
			case 'name': // default is to sort by name
			default:
				documentList.sort(documentNameComparator);
				break;
		}
		return documentList;
	}

	/**
	 * Gets the current state of the document based on its history.
	 * 
	 * @param  {String} id: document id
	 * @return {String} state of the document, one of: 'in', 'you', 'other' (see Data static constants)
	 */
	getDocumentState(id) {
		if (id in this.documents) {
			let document = this.documents[id];
			if (document.history.length == 0) {
				return Data.OTHER;
			}
			let lastEvent = this.events[document.history[document.history.length - 1]];
			if (lastEvent.action === Data.RETURN) {
				return Data.IN;
			} else {
				if (lastEvent.user === this.state.login) {
					return Data.YOU;
				} else {
					return Data.OTHER;
				}
			}
		} else {
			return null;
		}
	}

	canRetrieveDocument(id) {
		let document = this.getDocumentData(id);
		if (document === null) return { status: false, message: 'Not a valid item.'};
		if (document.out !== Data.IN) return { status: false, message: 'Item currently out.'};
		if (! document.locker) return { status: false, message: 'Item locker unknown - check history for possible misplacement.'}
		return { status: true };
	}

	retrieveDocument(id) {
		if (! this.canRetrieveDocument(id).status) {
			return false;
		}
		let eventID = this.addEvent({ document: id, action: Data.RETRIEVE });
		this.documents[id].history.push(eventID);
		let lockerID = this.documents[id].locker;
		this.updateDocument(id, {
			locker: null
		});
		this.freeLocker(lockerID);
		return true;
	}

	canReturnDocument(id) {
		let document = this.getDocumentData(id);
		if (document === null) return { status: false, message: 'Not a valid item.'};
		if (document.out === Data.IN) return { status: false, message: 'Item already in.'};
		if (! this.getEmptyLocker()) return { status: false, message: 'No available empty lockers.'};
		return { status: true };
	}

	returnDocument(id, lockerID=null) {
		if (! this.canReturnDocument(id).status) {
			return false;
		}
		lockerID = lockerID || this.getEmptyLocker();
		let eventID = this.addEvent({ document: id, action: Data.RETURN });
		this.documents[id].history.push(eventID);
		this.updateDocument(id, {
			locker: lockerID,
		});
		this.useLocker(lockerID);
		return true;
	}

	/**
	 * 
	 * FOLDERS
	 * 
	 */
	
	/**
	 * Creates a new folder.
	 * 
	 * @param {Object} data: folder data, links must be valid, see code
	 * @return {String} id of folder if successfully created, else null
	 */
	addFolder(data) {
		let folder = { // default values
			name: 'New Folder',	// {String}
			labels: [],			// {String[]} ids of labels
			parent: 'root',		// {String} id of parent folder
			folders: [],		// {String[]} ids of child folders
			documents: [],		// {String[]} ids of child documents
		}
		Object.assign(folder, data);
		let folderID = this.addEntry(this.folders, folder);
		if (folderID) {
			this.addFolderToFolder(folderID, folder.parent);
			return folderID;
		} else {
			return null;
		}
	}

	/**
	 * Updates a folder's data.
	 * 
	 * @param  {String} id: folder id
	 * @param  {Object} data: new values. All links must be valid
	 * @return {boolean} true if successful update
	 */
	updateFolder(id, data) {
		return this.updateEntry(this.folders, id, data);
	}

	getFolderData(id) {
		let folder = this.getCorrectedCopy(this.folders, id);
		if (folder === null) return null;

		folder.id = id;
		folder.labels = this.getLabelListData(folder.labels);
		folder.tiers = this.getFolderTiers(id);
		folder.folders = this.getFolderListAbbreviatedData(folder.folders);
		folder.documents = this.getDocumentListData(folder.documents);
		folder.path = this.getPath(id);

		return folder;
	}

	getFolderAbbreviatedData(id) {
		let folder = this.getCorrectedCopy(this.folders, id);
		if (folder === null) return null;

		folder.id = id;
		folder.labels = this.getLabelListData(folder.labels);
		folder.tiers = this.getFolderTiers(id);

		return folder;
	}

	getFolderListAbbreviatedData(idList) {
		let folderList = idList.map(id => this.getFolderAbbreviatedData(id)).filter(x => x);
		switch (this.state.documentsSort) {
			case 'accessTierAsc':
				folderList.sort(folderTiersComparator);
				break;
			case 'accessTierDesc':
				folderList.sort(folderTiersComparator).reverse();
				break;
			case 'labels':
				folderList.sort(documentLabelsComparator);
				break;
			case 'dateCreated': // implement when folder history is implemented
			case 'dateLastAccessed': // implement when folder history is implemented
			case 'name': // default is to sort by name
			default:
				folderList.sort(documentNameComparator);
				break;
		}
		return folderList;
	}

	/**
	 * Returns the tiers of this folder, which is the union of all
	 * the tiers of all documents and folders inside this folder.
	 * 
	 * @param  {String} id: folder id
	 * @return {Object[]} list of tier data, or null if broken links
	 */
	getFolderTiers(id) {
		if (id in this.folders) {
			let tiers = new Set();
			this._findFolderTiers(this.folders[id], tiers);
			tiers = Array.from(tiers);
			return this.getTierListData(tiers);
		} else {
			return null;
		}
	}

	/**
	 * Helper for getFolderTiers. Performs a DFS preorder traversal
	 * of the folder heirarchy in this folder, adding any found tiers
	 * to tiers.
	 * @param  {Object} folder: entry of folder in table
	 * @param  {Set} tiers: ids of tiers already found
	 */
	_findFolderTiers(folder, tiers) {
		for (let id of folder.documents) {
			let document = this.documents[id];
			if (document) {
				tiers.add(document.tier);
			}
		}
		for (let id of folder.folders) {
			let child = this.folders[id];
			if (child) {
				this._findFolderTiers(child, tiers);
			}
		}
	}

	/**
	 * Finds path of a folder
	 * 
	 * @param  {String} id: folder id
	 * @return {Object} two properties:
	 * 						folderDataList: list of folder abbreviated data
	 * 										First element is always root
	 * 										Last element is always folder passed in
	 * 						string: file path string, e.g. '\Folder 1\Folder 2\'
	 * 					or null if broken links
	 */
	getPath(id) {
		let current = id;
		let folderDataList = [];
		while (current != null) {
			if (current in this.folders) {
				let folder = this.getFolderAbbreviatedData(current);
				folderDataList.unshift(folder);
				current = folder.parent;
			} else {
				return null;
			}
		}
		let pathString = folderDataList.map(folder => folder.name).join("\\") + "\\";
		return {
			folderDataList: folderDataList,
			string: pathString,
		}
	}

	addDocumentToFolder(documentID, folderID) {
		let folder = this.folders[folderID];
		let document = this.documents[documentID];
		if (folder && document) {
			let folderDocuments = new Set(folder.documents);
			folderDocuments.add(documentID);
			this.updateFolder(folderID, { documents: Array.from(folderDocuments) });
		}
	}

	addFolderToFolder(childID, parentID) {
		let parent = this.folders[parentID];
		let child = this.folders[childID];
		if (parent && child) {
			let parentFolders = new Set(parent.folders);
			parentFolders.add(childID);
			this.updateFolder(parentID, { folders: Array.from(parentFolders) });
		}
	}

	/**
	 * 
	 * USERS
	 * 
	 */

	/**
	 * Creates a new user.
	 * 
	 * @param {Object} data: user data, links must be valid, see code
	 * @return {String} id of user if successfully created, else null
	 */
	addUser(data) {
		let user = { // default values
			firstName: '',		// {String}
			lastName: '',		// {String}
			tier: 'default',	// {String} id of tier
			email: '',			// {String}
		}
		Object.assign(user, data);
		return this.addEntry(this.users, user);
	}

	/**
	 * Updates a user's data.
	 * 
	 * @param  {String} id: user id
	 * @param  {Object} data: new values. All links must be valid
	 * @return {boolean} true if successful update
	 */
	updateUser(id, data) {
		return this.updateEntry(this.users, id, data);
	}

	getUserData(id) {
		let user = this.getCorrectedCopy(this.users, id);
		if (user === null) return null;

		user.id = id;
		user.tier = this.getTierData(user.tier);
		user.abbreviation = user.firstName.slice(0, 1).toUpperCase() + user.lastName.slice(0, 1).toUpperCase();
		user.fullName = common.fullName(user.firstName, user.lastName);

		return user;
	}

	getUserListData(idList) {
		return idList.map(id => this.getUserData(id)).filter(x => x);
	}

	/**
	 * Returns a list of all users (without any particular ordering),
	 * excluding the default users (Admin, Unknown).
	 * 
	 * @return {Object[]} List of user data
	 */
	getUserList() {
		let userIDs = Object.keys(this.users).filter(id => (
			id !== 'admin' &&
			id !== 'unknown'
		));
		return this.getUserListData(userIDs);
	}

	/**
	 * 
	 * TIERS
	 * 
	 */

	/**
	 * Creates a new tier.
	 * 
	 * @param {Object} data: tier data, links must be valid, see code
	 * @return {String} id of tier if successfully created, else null
	 */
	addTier(data) {
		let tier = { // default values
			name: 'Tier ' + Object.keys(this.tiers).length + 1,	// {String}
			color: common.randomColor(),					// {String} name of color from common.js
			rank: -100,										// {Number} rank of tier, higher ranks can access lower ranks
		}
		Object.assign(tier, data);
		return this.addEntry(this.tiers, tier);
	}

	/**
	 * Updates a tier's data.
	 * 
	 * @param  {String} id: tier id
	 * @param  {Object} data: new values. All links must be valid
	 * @return {boolean} true if successful update
	 */
	updateTier(id, data) {
		return this.updateEntry(this.tiers, id, data);
	}

	getTierData(id) {
		let tier = this.getCorrectedCopy(this.tiers, id);
		if (tier === null) return null;

		tier.id = id;

		return tier;
	}

	getTierListData(idList) {
		let tierList = idList.map(id => this.getTierData(id)).filter(x => x);
		tierList.sort(tierRankComparator);
		if (this.state.documentsSort === 'accessTierDesc') {
			tierList.reverse();
		}
		return tierList;
	}


	/**
	 * 
	 * LABELS
	 * 
	 */

	/**
	 * Creates a new label.
	 * 
	 * @param {Object} data: label data, links must be valid, see code
	 * @return {String} id of label if successfully created, else null
	 */
	addLabel(data) {
		let label = { // default values
			name: 'Label ' + Object.keys(this.labels).length + 1,	// {String}
			color: common.randomColor(),					// {String} name of color from common.js
		}
		Object.assign(label, data);
		return this.addEntry(this.labels, label);
	}

	/**
	 * Updates a label's data.
	 * 
	 * @param  {String} id: label id
	 * @param  {Object} data: new values. All links must be valid
	 * @return {boolean} true if successful update
	 */
	updateLabel(id, data) {
		return this.updateEntry(this.labels, id, data);
	}

	getLabelData(id) {
		let label = this.getCorrectedCopy(this.labels, id);
		if (label === null) return null;

		label.id = id;
		label.abbreviation = label.name.slice(0, 1).toUpperCase();

		return label;
	}

	getLabelListData(idList) {
		let labelList = idList.map(id => this.getLabelData(id)).filter(x => x);
		labelList.sort(labelNameComparator);
		return labelList;
	}


	/**
	 * 
	 * EVENTS
	 * 
	 */

	/**
	 * Creates a new event.
	 * 
	 * @param {Object} data: event data, links must be valid, see code
	 * @return {String} id of event if successfully created, else null
	 */
	addEvent(data) {
		let event = { // default values
			user: this.state.login,	// {String} id of user
			document: null,			// {String} id of document, or null if doesn't concern any document
			action: null,			// {String} one of 'created', 'retrieved', etc. See Data static constants
			date: new Date(),		// {Date} date of event
		}
		Object.assign(event, data);
		return this.addEntry(this.events, event);
	}

	getEventData(id) {
		let event = this.getCorrectedCopy(this.events, id);
		if (event === null) return null;

		event.id = id;
		event.user = this.getUserData(event.user);
		event.document = event.document ? this.getDocumentAbbreviatedData(event.document) : null;

		return event;
	}

	getEventListData(idList) {
		return idList.map(id => this.getEventData(id)).filter(x => x);
	}


	/**
	 * 
	 * LOCKERS
	 * 
	 */

	addLocker(data) {
		let id = this.addEntry(this.lockers, data);
		if (id === null) return null;
		this.freeLocker(id);
	}

	getLockerData(id) {
		let locker = this.getCorrectedCopy(this.lockers, id);
		if (locker === null) return null;

		locker.id = id;
		locker.cabinet = this.getCabinetData(locker.cabinet);

		return locker;
	}

	freeLocker(id) {
		if (id in this.lockers) {
			this.emptyLockers.add(id);
		}
	}

	useLocker(id) {
		if (id in this.lockers) {
			this.emptyLockers.delete(id);
		}
	}

	getEmptyLocker() {
		let lockerList = Array.from(this.emptyLockers);
		if (lockerList.length > 0) {
			return lockerList[Math.floor(Math.random() * lockerList.length)];
		} else {
			return null;
		}
	}


	/**
	 * 
	 * CABINETS
	 * 
	 */
	
	addCabinet(data) {
		return this.addEntry(this.cabinets, data);
	}

	getCabinetData(id) {
		let cabinet = this.getCorrectedCopy(this.cabinets, id);
		if (cabinet === null) return null;

		cabinet.id = id;

		return cabinet;
	}

	updateCabinet(id, data) {
		return this.updateEntry(this.cabinets, id, data);
	}

	/**
	 *
	 * SEARCH
	 * 
	 */

	/**
	 * Searches database for query string, and puts results in the
	 * fake folder with id 'search'. 
	 * Matches on these items and fields:
	 * 	documents:
	 * 		-name
	 * 		-description
	 * 		-label
	 * 	folders:
	 * 		-name
	 * 		-label
	 * Uses AND convention of search: items must have ALL of the search
	 * terms in them to match (but the terms do not all have to be in the
	 * same field).
	 * Searching is case insensitive, ignores punctuation, and matches on
	 * parts of words ('cat' matches 'catfish').
	 *
	 * Usage:
	 * 	let input = 'Hello, how are you?';
	 * 	data.search(input);
	 * 	data.setState({ folder: 'search' });
	 * 	application.distribute('update');
	 * 
	 * @param  {String} query -input search string
	 * @return {void} -no return
	 */
	search(query) {

		// Split query into individual words, remove punctuation
		let terms = query.split(/\W+/);

		// create regular expression tests for each term, ignoring case
		let tests = terms.map(term => new RegExp(term, 'i'));

		// Search labels and add to set of search criteria
		// 	-name
		let matchLabels = new Set();
		for (let id of Object.keys(this.labels)) {
			let label = this.labels[id];
			if (this._match(label.name, tests)) {
				matchLabels.add(id);
			}
		}

		// Search documents and add to result set
		// 	-name
		// 	-description
		// 	-labels in matchLabels
		let matchDocuments = [];
		for (let id of Object.keys(this.documents)) {
			let document = this.documents[id];
			let combinedFields = document.name + '\n' + document.description;
			if (this._match(combinedFields, tests)) {
				matchDocuments.push(id);
			} else if (document.labels.some(label => matchLabels.has(label))) {
				matchDocuments.push(id);
			}
		}

		// Search folders and add to result set
		// 	-name
		// 	-labels in matchLabels
		let matchFolders = [];
		for (let id of Object.keys(this.folders)) {
			if (id === 'root' || id === 'search') {
				continue;
			}
			let folder = this.folders[id];
			if (this._match(folder.name, tests)) {
				matchFolders.push(id);
			} else if (folder.labels.some(label => matchLabels.has(label))) {
				matchFolders.push(id);
			}
		}

		// Update search folder
		this.updateFolder('search', { documents: matchDocuments, folders: matchFolders });
	}

	/**
	 * Helper for search(). Tests that the string passes EVERY reg ex test.
	 * Behavior can als be changed to passing any test instead.
	 * @param  {String} string to search
	 * @param  {RegExp[]} tests  list of reg ex tests
	 * @return {boolean}        return true if pass every test
	 */
	_match(string, tests) {
		return tests.every(test => test.test(string));
	}

}

function folderTiersComparator(a, b) {
	if (a.tiers.length == 0 && b.tiers.length == 0) {
		return 0;
	} else if (a.tiers.length == 0 && b.tiers.length > 0) {
		return 1;
	} else if (a.tiers.length > 0 && b.tiers.length == 0) {
		return -1;
	} else {
		return tierRankComparator(a.tiers[0], b.tiers[0]);
	}
}

function documentNameComparator(a, b) {
	return a.name.localeCompare(b.name);
}

function documentLabelsComparator(a, b) {
	if (a.labels.length == 0 && b.labels.length == 0) {
		return 0;
	} else if (a.labels.length == 0 && b.labels.length > 0) {
		return 1;
	} else if (a.labels.length > 0 && b.labels.length == 0) {
		return -1;
	} else {
		return labelNameComparator(a.labels[0], b.labels[0]);
	}
}

function documentTierComparator(a, b) {
	return tierRankComparator(a.tier, b.tier);
}

function documentDateCreatedComparator(a, b) {
	return b.history[0].date.getTime() - a.history[0].date.getTime();
}

function documentDateLastAccessedComparator(a, b) {
	return b.history[b.history.length - 1].date.getTime() - a.history[a.history.length - 1].date.getTime();
}

function labelNameComparator(a, b) {
	return a.name.localeCompare(b.name);
}

function tierRankComparator(a, b) {
	return a.rank - b.rank;
}

/*********

SAMPLE DATA

*********/

export var sampleData = new Data();

let cabinet1 = sampleData.addCabinet({
	name: 'Cabinet 01',
	url: '',
	capacity: 17,
});

for (let i = 1; i <= sampleData.getCabinetData(cabinet1).capacity; i++) {
	sampleData.addLocker({
		cabinet: cabinet1,
		index: i,
	});
}
let tier2 = sampleData.addTier({ name: 'Tier 2', color: 'green', rank: -2 });
let tier3 = sampleData.addTier({ name: 'Tier 3', color: 'purple', rank: -3 });

let user1 = sampleData.addUser({
	firstName: 'allison',
	lastName: 'rory',
	tier: 'admin',
	email: 'arory@gmail.com',
});

sampleData.setState({
	login: user1
});

let user2 = sampleData.addUser({
	firstName: 'brian',
	lastName: 'chen',
	tier: tier3,
	email: 'bchen@gmail.com',
});
let user3 = sampleData.addUser({
	firstName: 'dominique',
	lastName: 'yano',
	tier: tier2,
	email: 'dyano@gmail.com',
});

let labelP = sampleData.addLabel({ name: 'P', color: "yellow" });
let labelC = sampleData.addLabel({ name: 'C', color:"green" });
let labelF = sampleData.addLabel({ name: 'F', color:"red"});

let folder1 = sampleData.addFolder({
	name: 'Work Permit apps',
	labels: [],
	parent: 'root',
});
let folder2 = sampleData.addFolder({
	name: 'Green Card apps',
	labels: [],
	parent: 'root',
});
let folder3 = sampleData.addFolder({
	name: 'Asylum apps',
	labels: [],
	parent: 'root',
});

let document1 = sampleData.addDocument({
	name: 'Andrew Wiggin',
	labels: [labelP],
	tier: tier3,
	description: 'Document 1 description',
	folder: 'root',
});
sampleData.returnDocument(document1);
sampleData.documents[document1].history.push(sampleData.addEvent({ user: user2, document: document1, action: Data.RETRIEVE }));
sampleData.documents[document1].history.push(sampleData.addEvent({ user: user2, document: document1, action: Data.RETURN }));
sampleData.documents[document1].history.push(sampleData.addEvent({ user: user3, document: document1, action: Data.RETRIEVE }));
sampleData.documents[document1].history.push(sampleData.addEvent({ user: user3, document: document1, action: Data.RETURN }));


let document11 = sampleData.addDocument({
	name: 'Taiko Berceyte ',
	labels: [labelF],
	tier: tier3,
	description: 'Document 11 description',
	folder: 'root',
});
sampleData.returnDocument(document11);
sampleData.documents[document11].history.push(sampleData.addEvent({ user: user2, document: document11, action: Data.RETRIEVE }));
sampleData.documents[document11].history.push(sampleData.addEvent({ user: user2, document: document11, action: Data.RETURN }));
sampleData.documents[document11].history.push(sampleData.addEvent({ user: user3, document: document11, action: Data.RETRIEVE }));
sampleData.documents[document11].history.push(sampleData.addEvent({ user: user3, document: document11, action: Data.RETURN }));

let document2 = sampleData.addDocument({
	name: 'Peter Hurst',
	labels: [labelF],
	tier: tier2,
	description: 'Document 2 description',
	folder: folder1,
});
sampleData.returnDocument(document2);
sampleData.documents[document2].history.push(sampleData.addEvent({ user: user2, document: document2, action: Data.RETRIEVE }));
sampleData.documents[document2].history.push(sampleData.addEvent({ user: user2, document: document2, action: Data.RETURN }));
sampleData.documents[document2].history.push(sampleData.addEvent({ user: user3, document: document2, action: Data.RETRIEVE }));


let documentNew = sampleData.addDocument({
	name: 'Eric Miller',
	labels: [labelP],
	tier: tier2,
	description: 'New Applicant',
	folder: folder1,
});
let docNewhis = [];
docNewhis.push(sampleData.addEvent({ user: user3, document: documentNew, action: Data.CREATE, date: new Date("2016-12-24") }));
docNewhis.push(sampleData.addEvent({ user: user3, document: documentNew, action: Data.RETRIEVE, date: new Date("2016-12-25") }));
docNewhis.push(sampleData.addEvent({ user: user3, document: documentNew, action: Data.RETURN, date:new Date("2016-12-26") }));
docNewhis.push(sampleData.addEvent({ user: user2, document: documentNew, action: Data.RETRIEVE, date: new Date("2016-12-27")}));
sampleData.updateDocument(documentNew, {history:docNewhis});
let document3 = sampleData.addDocument({
	name: 'Sebastian Vasquez',
	labels: [labelP],
	tier: 'admin',
	description: 'Document 3 description',
	folder: folder1,
});
sampleData.returnDocument(document3);
sampleData.documents[document3].history.push(sampleData.addEvent({ user: user2, document: document3, action: Data.RETRIEVE }));
sampleData.documents[document3].history.push(sampleData.addEvent({ user: user2, document: document3, action: Data.RETURN }));
sampleData.documents[document3].history.push(sampleData.addEvent({ user: user3, document: document3, action: Data.RETRIEVE }));
sampleData.documents[document3].history.push(sampleData.addEvent({ user: user3, document: document3, action: Data.RETURN }));

let document4 = sampleData.addDocument({
	name: 'Bretton Miller',
	labels: [labelC],
	tier: tier3,
	description: 'Document 4 description',
	folder: folder1
});
sampleData.returnDocument(document4);
let doc4his = [];
doc4his.push(sampleData.addEvent({ user: user2, document: document4, action: Data.CREATE, date: new Date("2015-03-24") }));
doc4his.push(sampleData.addEvent({ user: user2, document: document4, action: Data.RETRIEVE, date: new Date("2015-03-25") }));
doc4his.push(sampleData.addEvent({ user: user2, document: document4, action: Data.RETURN, date:new Date("2015-03-27") }));
doc4his.push(sampleData.addEvent({ user: user3, document: document4, action: Data.RETRIEVE, date: new Date("2016-10-01")}));
sampleData.updateDocument(document4, {history:doc4his});

let document5 = sampleData.addDocument({
	name: 'Nico Martinez',
	labels: [labelC],
	tier: tier2,
	description: 'Document 5 description',
	folder: folder1,
});
sampleData.returnDocument(document5);
sampleData.documents[document5].history.push(sampleData.addEvent({ user: user2, document: document5, action: Data.RETRIEVE }));
sampleData.documents[document5].history.push(sampleData.addEvent({ user: user2, document: document5, action: Data.RETURN }));
sampleData.documents[document5].history.push(sampleData.addEvent({ user: user3, document: document5, action: Data.RETRIEVE }));

let document6 = sampleData.addDocument({
	name: 'Frederick Miller',
	labels: [labelP],
	tier: tier3,
	description: 'Document 6 description',
	folder: folder2,
});
sampleData.returnDocument(document6);
sampleData.documents[document6].history.push(sampleData.addEvent({ user: user2, document: document6, action: Data.RETRIEVE }));
sampleData.documents[document6].history.push(sampleData.addEvent({ user: user2, document: document6, action: Data.RETURN }));
sampleData.documents[document6].history.push(sampleData.addEvent({ user: user3, document: document6, action: Data.RETRIEVE }));
sampleData.documents[document6].history.push(sampleData.addEvent({ user: user3, document: document6, action: Data.RETURN }));

let document7 = sampleData.addDocument({
	name: 'Petrach Miller',
	labels: [labelF],
	tier: tier2,
	description: 'Document 7 description',
	folder: folder2,
});
sampleData.returnDocument(document7);
sampleData.documents[document7].history.push(sampleData.addEvent({ user: user2, document: document7, action: Data.RETRIEVE }));
sampleData.documents[document7].history.push(sampleData.addEvent({ user: user2, document: document7, action: Data.RETURN }));
sampleData.documents[document7].history.push(sampleData.addEvent({ user: user3, document: document7, action: Data.RETRIEVE }));

let document8 = sampleData.addDocument({
	name: 'Lasinius Miller',
	labels: [labelP],
	tier: 'admin',
	description: 'Document 8 description',
	folder: folder2,
});
sampleData.returnDocument(document8);
sampleData.documents[document8].history.push(sampleData.addEvent({ user: user2, document: document8, action: Data.RETRIEVE }));
sampleData.documents[document8].history.push(sampleData.addEvent({ user: user2, document: document8, action: Data.RETURN }));
sampleData.documents[document8].history.push(sampleData.addEvent({ user: user3, document: document8, action: Data.RETRIEVE }));
sampleData.documents[document8].history.push(sampleData.addEvent({ user: user3, document: document8, action: Data.RETURN }));

let document9 = sampleData.addDocument({
	name: 'Darquitus Miller',
	labels: [labelC],
	tier: tier3,
	description: 'Document 9 description',
	folder: folder3,
});
sampleData.returnDocument(document9);
sampleData.documents[document9].history.push(sampleData.addEvent({ user: user2, document: document9, action: Data.RETRIEVE }));
sampleData.documents[document9].history.push(sampleData.addEvent({ user: user2, document: document9, action: Data.RETURN }));
sampleData.documents[document9].history.push(sampleData.addEvent({ user: user3, document: document9, action: Data.RETRIEVE }));
sampleData.documents[document9].history.push(sampleData.addEvent({ user: user3, document: document9, action: Data.RETURN }));

let document10 = sampleData.addDocument({
	name: 'Larson Chung',
	labels: [labelP],
	tier: tier2,
	description: 'Document 10 description',
	folder: folder3,
});
sampleData.returnDocument(document10);
sampleData.documents[document10].history.push(sampleData.addEvent({ user: user2, document: document10, action: Data.RETRIEVE }));
sampleData.documents[document10].history.push(sampleData.addEvent({ user: user2, document: document10, action: Data.RETURN }));
sampleData.documents[document10].history.push(sampleData.addEvent({ user: user3, document: document10, action: Data.RETRIEVE }));


