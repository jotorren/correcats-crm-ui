import { AlertService } from '../alert/alert.service';

export function handle(err: any, duration: number, alerter: AlertService) {
    let messages;
    if (err.error.errors) {
      messages = err.error.errors.map(item => item.message);
    } else {
      messages = [err.message];
    }

    if (messages.length === 1) {
      alerter.error(messages[0], {
        autoClose: true,
        duration: (duration + 1) * 1000,
        keepAfterRouteChange: false
      });
    } else {
      messages.forEach(item => {
        alerter.error('<li>' + item + '</li>', {
          autoClose: false,
          keepAfterRouteChange: false
        });
      });
    }
}
