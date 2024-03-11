export type Conversation = {
	_id: string;
	createdAt: Date;
	updateAt: Date;
	members: [
		{
			_id: string;
			username: string;
			profileImage?: string;
		},
	];
};
export type Member = {
	username: string;
	_id: string;
	profileImage?: string;
};

export type Message = {
	_id: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	senderId: {
		_id: string;
		username: string;
		profileImage?: string;
	};
	isRead: boolean;
	messageId: string;

	media?: {
		audio?: string;
		audiAssetId?: string;
		image?: string;
		imageAssetId?: string;
		video?: string;
		videoAssetId?: string;
	};
	__v: number;
};

export type MessageData = {
	createdAt: string;
	members: Member[];
	messages: Message[];
	updatedAt: string;
	__v: number;
	_id: string;
};
