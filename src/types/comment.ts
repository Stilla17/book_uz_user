type LocalizedTitle =
    | string
    | {
          uz?: string;
          ru?: string;
          en?: string;
      };

export type CommentStatus = 'approved' | 'aproved' | 'rejected' | 'pending';

export type PopulatedBook = {
    _id: string;
    title?: LocalizedTitle;
    slug?: string;
};

export type PopulatedUser = {
    _id: string;
    name?: string;
    email?: string;
};

export type AdminComment = {
    _id: string;
    book: string | PopulatedBook;
    user?: string | PopulatedUser;
    name: string;
    text: string;
    createdAt: string;
    updatedAt: string;
    status: CommentStatus;
};
