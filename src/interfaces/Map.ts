export interface ITaxi {
    driver_id: string,
    location: {
        bearing: number,
        latitude: number,
        longitude: number,
    }
}