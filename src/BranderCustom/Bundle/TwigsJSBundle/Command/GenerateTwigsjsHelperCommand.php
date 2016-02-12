<?php

namespace BranderCustom\Bundle\TwigsJSBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class GenerateTwigsjsHelperCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('custom:find:twigs')
            ->setDescription('...')
            ->addArgument('argument', InputArgument::OPTIONAL, 'Argument description')
            ->addOption('option', null, InputOption::VALUE_NONE, 'Option description')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $argument = $input->getArgument('argument');

        if ($input->getOption('option')) {
            // ...
        }

        $kernel = $this->getContainer()->get('kernel');

        $bundles = $kernel->getBundles();
        foreach ($bundles as $bundle) {
            $array[] = array(
          'name' => $bundle->getName(),
          'path' => $bundle->getPath(),
          'nameSpace' => $bundle->getNamespace(),
          );
            $name[$bundle->getName()] = array(
            'name' => $bundle->getName(),
            'path' => $bundle->getPath(),
            'nameSpace' => $bundle->getNamespace(),
          );
            $path[$bundle->getPath()] = array(
            'name' => $bundle->getName(),
            'path' => $bundle->getPath(),
            'nameSpace' => $bundle->getNamespace(),
          );
        }

        $output->writeln(json_encode(array(
          'array' => $array,
          'name' => $name,
          'path' => $path,
        )));
    }
}
