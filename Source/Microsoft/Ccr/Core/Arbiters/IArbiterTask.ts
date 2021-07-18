import { ITask } from 'Microsoft/Ccr/Core/ITask';
import { ArbiterTaskState } from './ArbiterTaskState';

export interface IArbiterTask extends ITask {
	readonly ArbiterState: ArbiterTaskState;

	Evaluate(receiver /*:ReceiverTask */, deferredTask: ITask): bool;
}
