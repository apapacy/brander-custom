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
        $bundles = array(); //$kernel->getBundles();
        $bunldlesNames = $this->container->getParameter('kernel.bundles');
        foreach ($bunldlesNames as $name => $path) {
          $bundles[] = array(
            'name' => $name,
            'path' => $path,
            'absolutePath' => $kernel->locateResource('@'.$name)
          );
        }
        print_r($bundles);
        die();

        return $this->render('BranderCustomTwigsJSBundle:Default:index.html.twig');
    }
}
