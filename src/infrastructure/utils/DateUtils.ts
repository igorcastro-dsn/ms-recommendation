export class DateUtils {
    
    static toUtcDateOnly(date: Date): Date {
        const updatedDate = new Date(date);
        return new Date(Date.UTC(updatedDate.getUTCFullYear(), updatedDate.getUTCMonth(), updatedDate.getUTCDate()));
    }

    static getCurrentDateString(): string {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

}