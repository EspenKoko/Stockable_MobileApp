import { Client } from "./clients"
import { PrinterModel } from "./printerModels";
import { PrinterStatus } from "./printerStatuses";

export interface AssignedPrinter {
  assignedPrinterId: number;
  serialNumber: string;

  //fk
  clientId: number;
  client: Client;

  //fk
  printerModelId: number;
  printerModel: PrinterModel;

  //fk
  printerStatusId: number;
  printerStatus: PrinterStatus;
}