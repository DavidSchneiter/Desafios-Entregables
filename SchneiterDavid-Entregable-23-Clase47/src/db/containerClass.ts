export class Colores {
  constructor(private colores: string[] = []) {}

  guardarColor(color: string): void {
    this.colores.push(color);
  }

  obtenerColor(): string[] {
    return this.colores;
  }
}
