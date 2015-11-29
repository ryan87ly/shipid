package shipit_plugin;

import javax.jms.DeliveryMode;
import javax.jms.Destination;
import javax.jms.JMSException;
import javax.jms.MessageProducer;
import javax.jms.TextMessage;
import javax.naming.NamingException;

public class QSender extends QCommon
{
    private MessageProducer sender;

    public void close() throws JMSException, NamingException, Throwable
    {
        try
        {
            if (sender != null)
            {
                sender.close();
            }
            super.close();
        }
        catch (Throwable e)
        {
            e.printStackTrace();
            throw e;
        }
    }

    public void sendMessage(String text) throws JMSException, Throwable
    {
        if (sender != null)
        {
            try
            {
                TextMessage message = session.createTextMessage(text);
                sender.send(message);
            }
            catch (Throwable e)
            {
                e.printStackTrace();
                throw e;
            }
        }
    }

    public void setQueue(String queueName) throws JMSException,
        NamingException, Throwable
    {
        try
        {
            if (connection != null)
            {
                connection.stop();
            }
            if (sender != null)
            {
                sender.close();
            }
            Destination queue = (Destination) getInitContext().lookup(queueName);
            sender = session.createProducer(queue);
            sender.setDeliveryMode(DeliveryMode.NON_PERSISTENT);
            sender.setPriority(4);
            sender.setTimeToLive(0);
            connection.start();
        }
        catch (Throwable e)
        {
            e.printStackTrace();
            throw e;
        }
    }
}
