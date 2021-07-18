import { XmlSchema } from 'System/Xml/Schema/XmlSchema';
import { XmlReader } from 'System/Xml/XmlReader';
import { XmlWriter } from 'System/Xml/XmlWriter';

export interface IXmlSerializable {
	GetSchema?(): XmlSchema;

	ReadXml?(reader: XmlReader): void;

	WriteXml?(writer: XmlWriter): void;
}
