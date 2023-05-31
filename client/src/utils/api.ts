export interface IVideo {
    id: number;
    title: string;
    thumbnail: string;
    duration: string;
}

const call = async (path: string, params: any = {}) => {
    const searchParams = new URLSearchParams(params);
    const response = await fetch(`${import.meta.env.SERVER_URL}/api/${path}?${searchParams.toString()}`);
    return await response.json();
};

export const searchSongs = async (searchValue: string): Promise<IVideo[]> => {
    return await call('videos', { search: searchValue });
};

export const allSongs = async (): Promise<IVideo[]> => {
    return await call('videos');
};

export const randomSongs = async (): Promise<IVideo[]> => {
    // return 30 random videos
    return await call('videos', { random: true, limit: 30 });
};

export const getVideo = async (id: number): Promise<IVideo> => {
    return await call(`videos/${id}`);
};


export const refreshIndex = async () => {
    await call('videos/refresh');
};
