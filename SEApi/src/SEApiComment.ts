import { SEApiShallowUser } from './SEApiShallowUser'

export interface SEApiComment {
    body?: string;
    body_markdown?: string;
    can_flag?: boolean;
    comment_id?: number;
    creation_date?: Date;
    edited?: boolean;
    link?: string;

    owner?: SEApiShallowUser;
    post_id?: number;
    post_type?: string;
    reply_to_user?: SEApiShallowUser;

    score?: number;
    upvoted?: boolean;
}