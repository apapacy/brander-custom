<?php

namespace BranderCustom\Bundle\TwigsJSBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

/**
 * @Route("/default")
 */
class DefaultController extends Controller
{
    const THIS_BUNDLE_NAME = 'BranderCustomTwigsJSBundl';

    /**
     * @Route("/index")
     */
    public function indexAction()
    {
        $kernel = $this->container->get('kernel');

        $bundles = $kernel->getBundles();
        $bunldlesNames = $this->container->getParameter('kernel.bundles');
        foreach ($bundles as $bundle) {
          $abundles[] = array(
            'name' => $bundle->getName(),
            'path' => $bundle->getPath(),
            'nameSpace' => $bundle->getNamespace(),
          );
        }
        print_r($abundles);
        die();

        return $this->render('BranderCustomTwigsJSBundle:Default:index.html.twig');
    }
}
