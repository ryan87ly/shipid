package shipit_plugin;

import java.util.concurrent.CopyOnWriteArrayList;
import javax.jms.JMSException;
import javax.naming.NamingException;

public class DummyPlugin
{
    public final static String                 JNDI_MQM       = "jms/connf";
    public final static String                 JNID_LISTEN_TO = "jms/qRequest";
    public final static String                 JNID_SEND_TO   = "jms/qReply";
    private static boolean                     isInit         = false;
    private static QSender                     sender         = null;
    private static QReceiver                   receiver       = null;
    public static CopyOnWriteArrayList<String> requests       = null;

    static
    {
        if (!isInit)
        {
            requests = new CopyOnWriteArrayList<String>();
            try
            {
                sender = new QSender();
                sender.setConnection(JNDI_MQM);
                sender.setQueue(JNID_SEND_TO);

                receiver = new QReceiver(requests);
                receiver.setConnection(JNDI_MQM);
                receiver.setQueue(JNID_LISTEN_TO);
            }
            catch (NamingException | JMSException e)
            {
                e.printStackTrace();
            }
            catch (Throwable e)
            {
                e.printStackTrace();
            }
            isInit = true;
            System.out.println("Initialize done...");
        }
    }

    public static void main(String[] args)
    {
        if (args == null || args.length != 1)
        {
            System.out.println("please give a name to this plugin");
            System.exit(-1);
        }
        else
        {
            System.out.println("this is [" + args[0] + "] running...");
        }

        try
        {
            while (true)
            {
                if (!requests.isEmpty())
                {
                    String req = requests.remove(0);
                    System.out.println("Q size [" + requests.size() + "]");
                    System.out.println("handling requst [" + req + "]...");
                    // TODO build reply
                    String reply = "this is reply...";
                    sender.sendMessage(reply);
                    System.out.println("reply has been sent...");
                }
                Thread.sleep(2000);
            }
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
                receiver.close();
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
