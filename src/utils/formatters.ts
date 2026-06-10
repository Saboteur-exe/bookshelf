export const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const ratingToStars = (rating: number): string => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
};

export const statusLabel: Record < string, string > = {
    read: 'Прочитано',
    reading: 'Читаю',
    wishlist: 'Хочу прочитать'
};

export const statusColor: Record < string, string > = {
    read: '#4caf50',
    reading: '#ff9800',
    wishlist: '#2196f3'
};
