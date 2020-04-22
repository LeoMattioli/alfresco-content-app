/** Singola riga di configurazione */
export interface DbCrawlerObject {
  label: string;
  dbfield: string;
  type: string;
  constraint: string;
  defaultvalue: string;
  order: number;
}

/** Configurazione globale */
export interface DbCrawlerConfig {
  id: number;
  nome: string;
  config: DbCrawlerObject[];
}
