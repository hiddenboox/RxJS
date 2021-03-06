import {Action} from './Action';
import {FutureAction} from './FutureAction';
import {AnimationFrame} from '../util/AnimationFrame';

export class AnimationFrameAction<T> extends FutureAction<T> {

  _schedule(state?: any, delay: number = 0): Action {
    if (delay > 0) {
      return super._schedule(state, delay);
    }
    this.delay = delay;
    this.state = state;
    const {scheduler} = this;
    scheduler.actions.push(this);
    if (!scheduler.scheduledId) {
      scheduler.scheduledId = AnimationFrame.requestAnimationFrame(() => {
        scheduler.scheduledId = null;
        scheduler.flush();
      });
    }
    return this;
  }

  _unsubscribe(): void {

    const {scheduler} = this;
    const {scheduledId, actions} = scheduler;

    super._unsubscribe();

    if (actions.length === 0) {
      scheduler.active = false;
      if (scheduledId != null) {
        scheduler.scheduledId = null;
        AnimationFrame.cancelAnimationFrame(scheduledId);
      }
    }
  }
}
