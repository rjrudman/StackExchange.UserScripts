export interface SEApiShallowUser {
    accept_rate?: number;
    
    /**
     * Not yet implemented
     */
    badge_counts?: any;

    link?: string;
    profile_image?: string;
    reputation?: number;
    user_id?: number;
    user_type?: 'unregistered' | 'registered' | 'moderator' | 'does_not_exist';
}