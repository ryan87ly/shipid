package shipit_plugin;

import javax.jms.JMSException;
import javax.naming.NamingException;

public class Test_fire_msg
{
    public static void main(String[] args)
    {
        QSender sender = new QSender();
        try
        {
            sender.setConnection(DummyPlugin.JNDI_MQM);
            sender.setQueue(DummyPlugin.JNID_LISTEN_TO);

            sender.sendMessage("this is reqeust....");
        }
        catch (NamingException | JMSException e)
        {
            e.printStackTrace();
        }
        catch (Throwable e)
        {
            e.printStackTrace();
        }
        finally
        {
            try
            {
                sender.close();
            }
            catch (NamingException | JMSException e)
            {
                e.printStackTrace();
            }
            catch (Throwable e)
            {
                e.printStackTrace();
            }

        }
    }
}
